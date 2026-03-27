# Project Context - Life Style Shop

## 1) Muc tieu san pham

**Life Style Shop** la nen tang thuong mai dien tu da vai tro, tap trung vao:
- Trai nghiem mua hang nhanh, ro rang, it buoc.
- Van hanh don hang on dinh cho Admin/Seller.
- Quan ly ton kho va doanh thu theo thoi gian thuc gan-thuc.
- De mo rong them kenh ban, them phuong thuc thanh toan, them module khuyen mai.

---

## 2) Doi tuong nguoi dung va gia tri

### Customer
- Tim kiem, loc, so sanh, xem danh gia, them gio, dat hang, theo doi don.
- Ky vong: gia minh bach, ton kho chinh xac, giao hang dung hen, hoan tien ro rang.

### Seller
- Tao/sua san pham, quan ly ton kho, xu ly don, cap nhat trang thai giao hang.
- Ky vong: dashboard de hieu, canh bao ton kho, doi soat thanh toan ro.

### Admin
- Quan tri toan bo he thong, duyet/noi dung, xu ly tranh chap, bao cao KPI.
- Ky vong: kiem soat rui ro, giam gian lan, dam bao SLA van hanh.

### Guest
- Xem catalog va thong tin co ban, bi gioi han khi thanh toan.

---

## 3) Mien nghiep vu cot loi

### 3.1 Catalog va discovery
- Danh muc san pham, thuoc tinh bien the (mau, size), thuong hieu, tag.
- Search full-text + loc theo gia, danh muc, rating, ton kho, khuyen mai.
- Sap xep theo lien quan, ban chay, moi nhat, gia tang/giam.
- SEO URL than thien va metadata cho trang chi tiet san pham.

### 3.2 Gio hang va checkout
- Gio hang luu theo user; guest cart co the merge khi dang nhap.
- Co che "reserve stock" khi checkout (tam giu ton kho co thoi han).
- Tinh phi ship theo dia chi, trong luong, khu vuc, don vi van chuyen.
- Ap dung coupon/khuyen mai theo quy tac uu tien va dieu kien.

### 3.3 Don hang va fulfilment
- Tao don tu snapshot gia tai thoi diem dat (khong phu thuoc gia hien tai).
- Tach don theo seller/kho neu can.
- Dong bo trang thai don - thanh toan - giao van.
- Ho tro huy mot phan/toan phan theo dieu kien trang thai.

### 3.4 Thanh toan va doi soat
- COD + online payment (gateway).
- Idempotency key cho callback/webhook tranh tao don trung.
- Doi soat thanh toan theo batch ngay, canh bao sai lech.

### 3.5 Danh gia va hau mai
- Chi nguoi da mua moi duoc review.
- Chinh sach moderation noi dung review.
- Ho tro tra hang/hoan tien theo cua so thoi gian va ly do hop le.

---

## 4) Luong nghiep vu chinh (end-to-end)

## A. Mua hang tieu chuan
1. User tim san pham -> xem chi tiet -> chon bien the.
2. Them gio -> cap nhat so luong.
3. Checkout -> xac thuc dia chi, ship method, coupon.
4. He thong:
   - Kiem tra ton kho kha dung.
   - Tinh tong tien: subtotal - discount + shipping + tax.
   - Tao payment intent (neu online).
5. User xac nhan thanh toan.
6. Tao order + order_items (snapshot gia, thuoc tinh, coupon ap dung).
7. Giam ton kho "sellable", tang "allocated".
8. Day sang fulfilment: pick-pack-ship.
9. Cap nhat trang thai giao hang + thong bao cho user.
10. Hoan tat don -> mo quyen review + ghi nhan doanh thu.

## B. Thanh toan that bai
1. Payment fail/timeout.
2. Don o trang thai `pending_payment` trong thoi gian T.
3. Qua T ma chua thanh toan: auto-cancel.
4. Giai phong ton kho da reserve.

## C. Huy don/Hoan tien
1. User yeu cau huy (neu chua giao cho don vi van chuyen).
2. He thong kiem tra policy theo trang thai don.
3. Neu online da thu tien:
   - Tao refund request.
   - Khi gateway xac nhan refund, cap nhat `refunded`.
4. Restock theo quy tac (toan phan/mot phan, hang loi khong restock).

---

## 5) Vong doi trang thai nghiep vu

### Order status (goi y)
- `draft` -> `pending_payment` -> `confirmed` -> `processing` -> `shipped` -> `delivered` -> `completed`
- Nhanh huy:
  - `pending_payment` -> `cancelled`
  - `confirmed|processing` -> `cancel_requested` -> `cancelled`
- Nhanh hoan:
  - `delivered|completed` -> `return_requested` -> `returned` -> `refunded`

### Payment status
- `unpaid`, `authorized`, `paid`, `partially_refunded`, `refunded`, `failed`, `expired`

### Inventory status
- `on_hand`: ton kho vat ly.
- `allocated`: da dat cho don chua xuat.
- `available_to_sell = on_hand - allocated`.
- Neu `available_to_sell <= safety_stock` -> bat canh bao low stock.

---

## 6) Quy tac nghiep vu quan trong

### 6.1 Gia va khuyen mai
- Gia don hang la immutable snapshot tai thoi diem dat.
- Uu tien ap gia:
  1) gia bien the
  2) flash sale
  3) coupon
  4) loyalty (neu co)
- Coupon co the gioi han theo:
  - Min order value
  - Danh muc/san pham
  - User segment
  - So lan dung toan he thong va moi user
  - Khung thoi gian hieu luc
- Khong cho phep "stack" coupon neu khong co cau hinh ro.

### 6.2 Ton kho
- Khong cho checkout neu `available_to_sell` khong du.
- Giam race condition bang optimistic lock hoac transaction.
- Reserve co TTL; het TTL se release.
- Restock khi huy/tra hang theo policy tinh trang san pham.

### 6.3 Van chuyen
- ETA duoc tinh theo SLA cua carrier + khu vuc + ngay nghi.
- Khi carrier nhan hang: order chuyen `shipped`.
- Don giao that bai nhieu lan -> tao exception queue cho CS.

### 6.4 Hoan tien
- Chi refund sau khi co su kien xac nhan tu gateway hoac quy trinh COD doi soat.
- Ho tro partial refund theo item, phi ship, ma khuyen mai.

### 6.5 Review
- Chi mo review khi don `delivered/completed`.
- Mot item trong mot order chi review 1 lan (co the sua trong cua so T).

---

## 7) Data model nghiep vu (logic-level)

### User
- role, status, verified flags, risk score (tuong lai), default address, wallet/points (tuong lai).

### Product
- sku, variants, base price, sale price, attributes, media, category, brand, active flag.

### Inventory
- sku, on_hand, allocated, reorder_point, safety_stock, warehouse_id.

### Cart
- user_id/guest_id, items, selected shipping option, coupon draft.

### Order
- order_no, buyer, seller split info, items snapshot, pricing breakdown, status timeline.

### Payment
- method, provider_ref, amount, status, transaction logs, refund logs.

### Shipment
- carrier, tracking_no, parcel events, delivery proof.

### Coupon
- code, type(percent/fixed/free_ship), constraints, quota, usage counters.

### Review
- order_item_ref, rating, content, moderation status.

---

## 8) Phan quyen va gioi han hanh dong

### Customer
- Tao/sua cart, tao order, huy don trong policy.
- Xem don cua chinh minh, tao review don da mua.

### Seller
- Quan ly san pham cua shop minh.
- Nhan va xu ly don duoc gan cho shop.
- Khong duoc truy cap du lieu tai chinh toan he thong.

### Admin
- Full permissions: user, order, refund, coupon, moderation, reporting, config.
- Co co che audit log bat buoc cho hanh dong nhay cam.

---

## 9) KPI nghiep vu can theo doi

- Conversion Rate (view -> add-to-cart -> checkout -> paid).
- Cart Abandonment Rate.
- Payment Success Rate theo gateway.
- Fulfillment Lead Time (dat hang den ship).
- On-time Delivery Rate.
- Return/Refund Rate.
- AOV (Average Order Value).
- Repeat Purchase Rate.
- Low Stock Incident va Out-of-stock Rate.

---

## 10) Ranh gioi ky thuat va nghiep vu

- Frontend: UX + state + validation dau vao + hien thi thong bao trang thai.
- Backend API: enforce business rules, authz, idempotency, transaction boundaries.
- Database: luu su that nghiep vu, su kien timeline, chi so truy van.
- External services (Cloudinary/Gateway/Email): xu ly media, thanh toan, giao tiep.

Luu y: Moi nghiep vu quan trong (thanh toan, refund, shipment) nen co event log de truy vet.

---

## 11) Rui ro nghiep vu va bien phap

- Oversell ton kho -> dung reservation + locking + reconciliation job.
- Don trung do retry callback -> idempotency key + unique constraints.
- Gian lan coupon -> rate-limit + anti-abuse rules + device/IP heuristics.
- Hoan tien sai -> quy trinh hai buoc (request + approve) cho case gia tri cao.
- Sai lech doi soat COD -> daily settlement report + exception handling queue.

---

## 12) Giai doan phat trien de xuat

### Phase 1 (MVP)
- Auth, catalog, cart, checkout, order, COD, basic admin.

### Phase 2
- Online payment gateway, coupon nang cao, shipment tracking, review moderation.

### Phase 3
- Loyalty, recommendation, BI dashboard, fraud detection rules.

---

## 13) Tieu chuan tai lieu lien quan

- `Agent.md`: tong quan cong nghe va cau truc.
- `project-context.md` (file nay): logic nghiep vu va quy tac van hanh.
- Nen bo sung sau: `adr/`, `api-contracts/`, `runbooks/`, `incident-playbooks/`.

---

**Last Updated**: March 2026  
**Version**: 1.0.0  
**Status**: Active Development
