# Database Schema - Life Style Shop

## 1) Overview

- Database type: MongoDB
- Modeling style: Document-first, references for large/independent aggregates
- Main modules: Auth, Catalog, Cart, Order, Payment, Shipping, Promotion, Review
- Naming: camelCase fields, plural collection names

---

## 2) Collection map

- `users`
- `addresses`
- `categories`
- `products`
- `inventories`
- `carts`
- `orders`
- `payments`
- `shipments`
- `coupons`
- `coupon_usages`
- `reviews`
- `notifications`
- `audit_logs`

---

## 3) Core collections

## 3.1 `users`

### Purpose
Store account identity, role, and account status.

### Suggested fields
```json
{
  "_id": "ObjectId",
  "email": "string (unique, lowercase)",
  "phone": "string (optional)",
  "passwordHash": "string",
  "fullName": "string",
  "avatarUrl": "string|null",
  "role": "guest|customer|seller|admin",
  "status": "active|locked|pending_verification",
  "isEmailVerified": "boolean",
  "lastLoginAt": "Date|null",
  "defaultAddressId": "ObjectId|null",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Indexes
- Unique: `{ email: 1 }`
- Query support: `{ role: 1, status: 1 }`

---

## 3.2 `addresses`

### Purpose
Store user shipping/billing addresses.

### Suggested fields
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref users)",
  "label": "Home|Office|Other",
  "receiverName": "string",
  "receiverPhone": "string",
  "line1": "string",
  "line2": "string|null",
  "ward": "string",
  "district": "string",
  "city": "string",
  "country": "string",
  "postalCode": "string|null",
  "isDefault": "boolean",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Indexes
- `{ userId: 1, isDefault: 1 }`

---

## 3.3 `categories`

### Purpose
Product taxonomy with optional parent-child hierarchy.

### Suggested fields
```json
{
  "_id": "ObjectId",
  "name": "string",
  "slug": "string (unique)",
  "parentId": "ObjectId|null",
  "isActive": "boolean",
  "sortOrder": "number",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Indexes
- Unique: `{ slug: 1 }`
- Hierarchy query: `{ parentId: 1, isActive: 1 }`

---

## 3.4 `products`

### Purpose
Store product catalog with variants and media.

### Suggested fields
```json
{
  "_id": "ObjectId",
  "sellerId": "ObjectId (ref users)",
  "name": "string",
  "slug": "string (unique)",
  "description": "string",
  "categoryId": "ObjectId (ref categories)",
  "brand": "string|null",
  "tags": ["string"],
  "status": "draft|active|archived",
  "basePrice": "number",
  "salePrice": "number|null",
  "currency": "VND|USD",
  "media": [
    {
      "url": "string",
      "publicId": "string",
      "alt": "string|null",
      "sortOrder": "number"
    }
  ],
  "variants": [
    {
      "_id": "ObjectId",
      "sku": "string (unique)",
      "attributes": {
        "size": "string",
        "color": "string"
      },
      "price": "number|null",
      "salePrice": "number|null",
      "isActive": "boolean"
    }
  ],
  "ratingAvg": "number",
  "ratingCount": "number",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Indexes
- Unique: `{ slug: 1 }`
- Unique: `{ "variants.sku": 1 }` (or separate sku map collection)
- Search/filter: `{ categoryId: 1, status: 1, createdAt: -1 }`
- Text index: `{ name: "text", description: "text", tags: "text" }`

---

## 3.5 `inventories`

### Purpose
Track stock by SKU/variant and warehouse.

### Suggested fields
```json
{
  "_id": "ObjectId",
  "productId": "ObjectId (ref products)",
  "variantId": "ObjectId (ref products.variants._id)",
  "sku": "string",
  "warehouseId": "string",
  "onHand": "number",
  "allocated": "number",
  "safetyStock": "number",
  "reorderPoint": "number",
  "updatedAt": "Date"
}
```

### Derived value
- `availableToSell = onHand - allocated`

### Indexes
- Unique: `{ sku: 1, warehouseId: 1 }`
- Low-stock scan: `{ warehouseId: 1, safetyStock: 1 }`

---

## 3.6 `carts`

### Purpose
Persist cart per user (or guest session).

### Suggested fields
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId|null",
  "guestId": "string|null",
  "items": [
    {
      "productId": "ObjectId",
      "variantId": "ObjectId|null",
      "sku": "string",
      "name": "string",
      "unitPrice": "number",
      "quantity": "number",
      "lineTotal": "number"
    }
  ],
  "couponCode": "string|null",
  "selectedShipping": {
    "method": "string",
    "fee": "number"
  },
  "expiresAt": "Date|null",
  "updatedAt": "Date",
  "createdAt": "Date"
}
```

### Indexes
- Unique partial: `{ userId: 1 }`
- Session lookup: `{ guestId: 1 }`

---

## 3.7 `orders`

### Purpose
Immutable purchase snapshot and lifecycle state.

### Suggested fields
```json
{
  "_id": "ObjectId",
  "orderNo": "string (unique)",
  "userId": "ObjectId (ref users)",
  "sellerIds": ["ObjectId"],
  "status": "pending_payment|confirmed|processing|shipped|delivered|completed|cancelled",
  "paymentStatus": "unpaid|authorized|paid|partially_refunded|refunded|failed|expired",
  "items": [
    {
      "productId": "ObjectId",
      "variantId": "ObjectId|null",
      "sku": "string",
      "name": "string",
      "attributes": { "size": "string", "color": "string" },
      "unitPrice": "number",
      "salePrice": "number|null",
      "quantity": "number",
      "lineTotal": "number"
    }
  ],
  "pricing": {
    "subtotal": "number",
    "discountTotal": "number",
    "shippingFee": "number",
    "taxTotal": "number",
    "grandTotal": "number",
    "currency": "VND|USD"
  },
  "coupon": {
    "code": "string|null",
    "discountType": "percent|fixed|free_ship|null",
    "discountValue": "number"
  },
  "shippingAddressSnapshot": {
    "receiverName": "string",
    "receiverPhone": "string",
    "line1": "string",
    "ward": "string",
    "district": "string",
    "city": "string",
    "country": "string"
  },
  "statusTimeline": [
    { "status": "string", "at": "Date", "by": "ObjectId|null", "note": "string|null" }
  ],
  "placedAt": "Date",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Indexes
- Unique: `{ orderNo: 1 }`
- User order history: `{ userId: 1, createdAt: -1 }`
- Admin operations: `{ status: 1, paymentStatus: 1, createdAt: -1 }`

---

## 3.8 `payments`

### Purpose
Track payment transactions and refund operations.

### Suggested fields
```json
{
  "_id": "ObjectId",
  "orderId": "ObjectId (ref orders)",
  "method": "cod|card|bank_transfer|ewallet",
  "provider": "stripe|momo|vnpay|cod",
  "providerRef": "string|null",
  "idempotencyKey": "string",
  "status": "unpaid|authorized|paid|partially_refunded|refunded|failed|expired",
  "amount": "number",
  "currency": "VND|USD",
  "paidAt": "Date|null",
  "transactions": [
    {
      "type": "authorize|capture|refund|void",
      "amount": "number",
      "providerTxnId": "string|null",
      "rawPayload": "object|null",
      "createdAt": "Date"
    }
  ],
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Indexes
- Unique: `{ idempotencyKey: 1 }`
- Provider callback lookup: `{ provider: 1, providerRef: 1 }`
- Order link: `{ orderId: 1 }`

---

## 3.9 `shipments`

### Purpose
Track delivery process and carrier events.

### Suggested fields
```json
{
  "_id": "ObjectId",
  "orderId": "ObjectId (ref orders)",
  "carrier": "string",
  "serviceLevel": "standard|express|same_day",
  "trackingNo": "string",
  "status": "created|picked_up|in_transit|delivered|failed|returned",
  "events": [
    {
      "code": "string",
      "description": "string",
      "at": "Date",
      "location": "string|null"
    }
  ],
  "eta": "Date|null",
  "deliveredAt": "Date|null",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Indexes
- Unique: `{ trackingNo: 1 }`
- Query by order: `{ orderId: 1 }`

---

## 3.10 `coupons`

### Purpose
Promotion rules and coupon constraints.

### Suggested fields
```json
{
  "_id": "ObjectId",
  "code": "string (unique, uppercase)",
  "name": "string",
  "type": "percent|fixed|free_ship",
  "value": "number",
  "minOrderValue": "number",
  "maxDiscount": "number|null",
  "startAt": "Date",
  "endAt": "Date",
  "isActive": "boolean",
  "usageLimitTotal": "number|null",
  "usageLimitPerUser": "number|null",
  "usedCount": "number",
  "appliesTo": {
    "categories": ["ObjectId"],
    "products": ["ObjectId"],
    "userSegments": ["string"]
  },
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Indexes
- Unique: `{ code: 1 }`
- Validity scan: `{ isActive: 1, startAt: 1, endAt: 1 }`

---

## 3.11 `coupon_usages`

### Purpose
Track each coupon redemption to enforce user/global limits.

### Suggested fields
```json
{
  "_id": "ObjectId",
  "couponId": "ObjectId (ref coupons)",
  "userId": "ObjectId (ref users)",
  "orderId": "ObjectId (ref orders)",
  "discountAmount": "number",
  "usedAt": "Date"
}
```

### Indexes
- `{ couponId: 1, userId: 1, usedAt: -1 }`
- `{ orderId: 1 }`

---

## 3.12 `reviews`

### Purpose
Store product reviews linked to purchased order items.

### Suggested fields
```json
{
  "_id": "ObjectId",
  "productId": "ObjectId (ref products)",
  "orderId": "ObjectId (ref orders)",
  "orderItemSku": "string",
  "userId": "ObjectId (ref users)",
  "rating": "number (1-5)",
  "title": "string|null",
  "content": "string",
  "status": "pending|published|hidden",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Indexes
- One review per purchased item: `{ orderId: 1, orderItemSku: 1, userId: 1 }` unique
- Product review listing: `{ productId: 1, status: 1, createdAt: -1 }`

---

## 4) Supporting collections

## 4.1 `notifications`
System/user notifications (order update, payment update, promotions).

## 4.2 `audit_logs`
Admin-sensitive actions: user lock/unlock, refund approval, coupon changes.

Suggested minimal fields:
```json
{
  "_id": "ObjectId",
  "actorId": "ObjectId",
  "action": "string",
  "targetType": "string",
  "targetId": "ObjectId|string",
  "metadata": "object",
  "createdAt": "Date"
}
```

---

## 5) Relationship summary

- `users` 1 - n `addresses`
- `users` 1 - n `orders`
- `categories` 1 - n `products`
- `products` 1 - n `inventories` (by variant/warehouse)
- `orders` 1 - 1..n `payments`
- `orders` 1 - 0..n `shipments`
- `coupons` 1 - n `coupon_usages`
- `products` 1 - n `reviews`

---

## 6) Data integrity rules

- Order item pricing is immutable snapshot at order time.
- Never trust client totals; recompute on backend before creating order.
- Stock updates for checkout/cancel/refund must be atomic or transactional.
- Payment/refund operations must be idempotent.
- Review creation requires matching purchased order item and valid status.

---

## 7) TTL and cleanup recommendations

- Guest carts TTL: 7-30 days (index on `expiresAt`).
- Pending payment expiration handling via job queue + status update.
- Optional log retention policy for `audit_logs` and raw gateway payloads.

---

## 8) Migration and versioning notes

- Additive schema change first, backfill later, then enforce required fields.
- Keep application-level validators aligned with schema updates.
- Record migration scripts and rollback notes in deployment docs.
