# TODO - Life Style Shop (Sprint Plan)

## Sprint 1 - Foundation + Auth + Catalog (Week 1-2)

### Goal
- Dung duoc he thong co ban: FE/BE chay on dinh, user dang ky/dang nhap, xem danh sach san pham.

### Backlog
- [ ] Chot cau truc du an `frontend/` + `backend/`
- [ ] Tao `.env.example` cho FE/BE
- [ ] Setup eslint + prettier + convention commit
- [ ] Setup CI (lint + test + build)
- [ ] Khoi tao React app + Router + state management
- [ ] Khoi tao Express server + middleware co ban
- [ ] Ket noi MongoDB, tao model `User`, `Product`, `Category`
- [ ] Hoan thien auth JWT + refresh token
- [ ] Hoan thien API `auth/*`, `products/*`, `categories/*`
- [ ] Hoan thien UI Home + Product List + Product Detail

### Definition of done
- [ ] Dang ky/dang nhap thanh cong, token flow hoat dong.
- [ ] Trang danh sach va chi tiet san pham doc du lieu tu API.
- [ ] CI pass tren nhanh chinh.

---

## Sprint 2 - Cart + Checkout + Order (Week 3-4)

### Goal
- Hoan thanh luong mua hang tu gio hang den tao don.

### Backlog
- [ ] Xay dung cart API va cart UI
- [ ] Them update/remove/clear cart
- [ ] Xay dung checkout page (dia chi, shipping, summary)
- [ ] Tao order tu checkout payload
- [ ] Chot order state machine ban dau
- [ ] Dong bo endpoint theo `docs/api-spec.md` (nhom Cart/Orders)
- [ ] Chuan hoa response success/error
- [ ] Them validation schema cho endpoint ghi du lieu
- [ ] Them lich su don hang trong user dashboard
- [ ] Viet integration test cho auth/cart/order

### Definition of done
- [ ] User dat duoc don hang thanh cong.
- [ ] Order duoc luu dung pricing snapshot.
- [ ] Don co trang thai ban dau va hien thi trong order history.

---

## Sprint 3 - Payment + Inventory + Coupon + Reviews (Week 5-6)

### Goal
- Hoan thien nghiep vu quan trong sau checkout va hau mai.

### Backlog
- [ ] Tich hop payment gateway + webhook
- [ ] Them idempotency cho payment/refund endpoints
- [ ] Hoan thien reserve stock + release theo TTL
- [ ] Hoan thien policy huy don/hoan tien
- [ ] Hoan thien coupon validation/apply policy
- [ ] Them review rule: chi nguoi da mua moi duoc review
- [ ] Toi uu index/query cho collection order/payment
- [ ] Them rate limiting cho auth/search/coupon validate
- [ ] Them request logging + correlation id
- [ ] Viet test cho payment flow va edge cases

### Definition of done
- [ ] Thanh toan online/COD xu ly dung trang thai.
- [ ] Khong oversell trong case dat hang dong thoi co ban.
- [ ] Refund/co cancel flow duoc ghi nhan day du.

---

## Sprint 4 - Admin + Hardening + Deploy (Week 7-8)

### Goal
- San sang staging/production voi dashboard van hanh va tai lieu day du.

### Backlog
- [ ] Tao admin dashboard tong quan KPI
- [ ] Quan ly user status (lock/unlock)
- [ ] Quan ly coupon va review moderation
- [ ] Bao cao sales/order theo ngay-thang
- [ ] Hoan thien role permissions test (customer/seller/admin)
- [ ] E2E test cho flow mua hang chinh
- [ ] Cau hinh deploy FE + BE (staging)
- [ ] Setup monitoring + alert cho backend
- [ ] Tao runbook xu ly su co co ban
- [ ] Cap nhat `README.md`, `project-context.md`, ADR, onboarding docs

### Definition of done
- [ ] Co moi truong staging chay on dinh.
- [ ] Dashboard admin xem duoc KPI chinh.
- [ ] Tai lieu setup + van hanh du de onboarding team.

---

## Backlog sau Sprint 4 (Nice-to-have)
- [ ] Loyalty program / points
- [ ] Recommendation engine
- [ ] BI dashboard nang cao
- [ ] Fraud detection rules
- [ ] Full OpenAPI spec (`docs/openapi.yaml`)
