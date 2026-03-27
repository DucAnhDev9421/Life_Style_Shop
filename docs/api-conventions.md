# API Conventions - Route Naming

## 1) Muc tieu

Tai lieu nay dinh nghia quy tac dat ten route de:
- Nhat quan giua cac module.
- De doc, de doan hanh vi endpoint.
- Giam breaking changes khi mo rong API.

---

## 2) Nguyen tac chung

- Dat ten theo **resource** (danh tu so nhieu), khong dat theo dong tu.
- Dung lowercase + kebab-case cho path segments.
- Khong dung dau gach duoi `_` trong URL path.
- Dung HTTP method de bieu dien hanh dong CRUD.
- Tranh route mang tinh RPC (vi du: `/getUsers`, `/createOrder`).

---

## 3) Quy uoc prefix

- Base prefix: `/api`
- Versioning: `/api/v1/...`
- Tat ca endpoint moi phai o namespace version.

Vi du:
- `GET /api/v1/products`
- `POST /api/v1/orders`

---

## 4) Quy tac dat ten resource

### 4.1 Danh tu so nhieu
- Dung so nhieu cho collection:
  - `/users`
  - `/products`
  - `/orders`

### 4.2 Dinh danh tai nguyen don le
- Su dung `/:id` cho tai nguyen cu the:
  - `GET /products/:id`
  - `PUT /orders/:id`

### 4.3 Nested resources
- Chi nested khi quan he cha-con ro rang:
  - `GET /products/:id/reviews`
  - `POST /orders/:id/refunds`
- Khong nested qua 2 muc neu khong can thiet.

---

## 5) Mapping method -> hanh vi

- `GET /resources` -> danh sach
- `GET /resources/:id` -> chi tiet
- `POST /resources` -> tao moi
- `PUT /resources/:id` -> cap nhat toan bo
- `PATCH /resources/:id` -> cap nhat mot phan
- `DELETE /resources/:id` -> xoa/huy

Luu y:
- Neu he thong dung soft delete, van giu `DELETE` cho hanh vi remove logic.

---

## 6) Route dac thu nghiep vu (non-CRUD)

Khi bat buoc co hanh dong dac thu:
- Dung sub-resource mang y nghia nghiep vu, khong dung dong tu chung chung.

Nen dung:
- `POST /orders/:id/cancellations`
- `POST /orders/:id/refunds`
- `POST /auth/login`
- `POST /auth/refresh`

Khong nen dung:
- `POST /cancelOrder`
- `POST /orders/:id/do-cancel`
- `POST /orders/refundNow`

---

## 7) Query naming conventions

Dung query params nhat quan:
- Pagination: `page`, `limit`
- Search: `q`
- Sort: `sortBy`, `sortOrder`
- Filter: `status`, `category`, `minPrice`, `maxPrice`

Vi du:
- `GET /products?page=1&limit=20&category=shoes&sortBy=createdAt&sortOrder=desc`

---

## 8) Trang thai HTTP (goi y)

- `200` GET/PUT/PATCH thanh cong
- `201` POST tao moi thanh cong
- `204` DELETE thanh cong khong tra body
- `400` du lieu dau vao khong hop le
- `401` chua xac thuc
- `403` khong du quyen
- `404` khong tim thay tai nguyen
- `409` xung dot du lieu/trang thai
- `422` validation nghiep vu that bai
- `500` loi he thong

---

## 9) Quy tac naming theo module hien tai

### Auth
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`

### Catalog
- `GET /api/v1/products`
- `GET /api/v1/products/:id`
- `GET /api/v1/categories`

### Cart
- `GET /api/v1/cart`
- `POST /api/v1/cart/items`
- `PATCH /api/v1/cart/items/:itemId`
- `DELETE /api/v1/cart/items/:itemId`

### Orders and payments
- `POST /api/v1/orders`
- `GET /api/v1/orders/:id`
- `POST /api/v1/orders/:id/cancellations`
- `POST /api/v1/payments/intent`
- `POST /api/v1/payments/webhook`

---

## 10) Checklist review route moi

- [ ] Route dung namespace `/api/v1`
- [ ] Path theo resource (danh tu so nhieu)
- [ ] Khong dung dong tu trong path CRUD thong thuong
- [ ] Method HTTP dung ngu nghia
- [ ] Query params dung convention chung
- [ ] Co tai lieu cap nhat trong `docs/api-spec.md`
