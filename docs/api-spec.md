# API Specification - Life Style Shop

## Base information

- Base URL (dev): `http://localhost:5000/api/v1`
- Auth method: `Authorization: Bearer <access_token>`
- Main roles: `guest`, `customer`, `seller`, `admin`
- Response format: JSON

---

## 1) Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/auth/register` | No | Register a new customer account |
| POST | `/api/v1/auth/login` | No | User login and token issue |
| POST | `/api/v1/auth/refresh` | Refresh token | Issue new access token |
| POST | `/api/v1/auth/logout` | Yes | Invalidate user session/token |
| GET | `/api/v1/auth/verify` | Yes | Verify current token validity |

---

## 2) Products

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/products` | No | Get product list (supports filter/sort/pagination) |
| GET | `/api/v1/products/:id` | No | Get product detail |
| GET | `/api/v1/products/search` | No | Search products by keyword/criteria |
| POST | `/api/v1/products` | Admin/Seller | Create new product |
| PUT | `/api/v1/products/:id` | Admin/Seller | Update product |
| DELETE | `/api/v1/products/:id` | Admin/Seller | Soft delete or remove product |

### Suggested query params for list/search
- `page`, `limit`
- `q` (search text)
- `category`, `brand`, `minPrice`, `maxPrice`
- `sortBy`, `sortOrder`
- `inStock`, `rating`

---

## 3) Categories

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/categories` | No | Get all categories |
| POST | `/api/v1/categories` | Admin | Create category |
| PUT | `/api/v1/categories/:id` | Admin | Update category |
| DELETE | `/api/v1/categories/:id` | Admin | Delete category |

---

## 4) Cart

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/cart` | Customer | Get current cart |
| POST | `/api/v1/cart/items` | Customer | Add item to cart |
| PUT | `/api/v1/cart/items/:itemId` | Customer | Update cart item quantity/variant |
| DELETE | `/api/v1/cart/items/:itemId` | Customer | Remove one item from cart |
| DELETE | `/api/v1/cart` | Customer | Clear cart |

---

## 5) Orders

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/orders` | Customer | Create new order from cart/checkout payload |
| GET | `/api/v1/orders` | Customer/Admin | Get orders (customer sees own orders) |
| GET | `/api/v1/orders/:id` | Customer/Admin | Get order detail |
| PUT | `/api/v1/orders/:id` | Admin/Seller | Update order status |
| DELETE | `/api/v1/orders/:id` | Customer/Admin | Cancel order based on policy |

### Common order statuses
- `pending_payment`, `confirmed`, `processing`, `shipped`, `delivered`, `completed`, `cancelled`

---

## 6) Payments

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/payments/intent` | Customer | Create payment intent for online payment |
| POST | `/api/v1/payments/webhook` | Gateway | Payment callback/webhook endpoint |
| GET | `/api/v1/payments/:orderId` | Customer/Admin | Get payment status for an order |
| POST | `/api/v1/payments/:orderId/refund` | Admin | Create full/partial refund |

---

## 7) Users and Profile

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/users/profile` | Customer/Seller/Admin | Get current user profile |
| PUT | `/api/v1/users/profile` | Customer/Seller/Admin | Update profile |
| GET | `/api/v1/users/addresses` | Customer | Get user addresses |
| POST | `/api/v1/users/addresses` | Customer | Add new address |
| PUT | `/api/v1/users/addresses/:id` | Customer | Update address |
| DELETE | `/api/v1/users/addresses/:id` | Customer | Delete address |

---

## 8) Reviews

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/products/:id/reviews` | No | Get reviews of a product |
| POST | `/api/v1/products/:id/reviews` | Customer | Create review for purchased product |
| PUT | `/api/v1/reviews/:id` | Customer/Admin | Update review (policy-based) |
| DELETE | `/api/v1/reviews/:id` | Customer/Admin | Delete/hide review |

---

## 9) Coupons

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/coupons/validate` | Customer | Validate coupon before checkout |
| GET | `/api/v1/coupons` | Admin | List coupons |
| POST | `/api/v1/coupons` | Admin | Create coupon |
| PUT | `/api/v1/coupons/:id` | Admin | Update coupon |
| DELETE | `/api/v1/coupons/:id` | Admin | Disable/delete coupon |

---

## 10) Admin Operations

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/admin/dashboard` | Admin | Aggregate metrics for dashboard |
| GET | `/api/v1/admin/users` | Admin | List/search users |
| PUT | `/api/v1/admin/users/:id/status` | Admin | Lock/unlock user account |
| GET | `/api/v1/admin/orders` | Admin | System-wide order management |
| GET | `/api/v1/admin/reports/sales` | Admin | Sales and KPI reports |

---

## 11) Response conventions

### Success
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error
```json
{
  "success": false,
  "code": "VALIDATION_ERROR",
  "message": "Invalid request payload",
  "errors": []
}
```

---

## 12) Notes for implementation

- Keep endpoint behavior backward-compatible where possible.
- Validate all request inputs before controller logic.
- Use idempotency for create-payment-refund operations.
- Add rate limiting for auth, search, and coupon validation endpoints.
- Maintain API docs when changing route contracts.
