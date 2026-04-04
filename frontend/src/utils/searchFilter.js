/**
 * Thuật toán tìm kiếm & lọc sản phẩm phía client.
 * Dùng được với mock hoặc sau này gắn API: server trả danh sách, client lọc tạm;
 * hoặc đồng bộ query string với GET /products?category=&min=&max=.
 */

export function normalizeText(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
}

/** Khớp từ khóa: tìm chuỗi con trong name + tagline (không phân biệt hoa thường). */
export function productMatchesQuery(product, rawQuery) {
  const q = normalizeText(rawQuery)
  if (!q) return true
  const haystack = normalizeText(`${product.name} ${product.tagline ?? ''}`)
  return haystack.includes(q)
}

/**
 * Danh mục: nếu không chọn gì → không lọc theo danh mục.
 * Nếu chọn một hoặc nhiều → OR: sản phẩm thuộc một trong các danh mục đã chọn.
 */
export function productMatchesCategories(product, selectedCategoryIds) {
  if (!selectedCategoryIds?.length) return true
  return selectedCategoryIds.includes(product.categoryId)
}

/** Giá: so sánh số (priceValue), khoảng [min, max] đóng. */
export function productMatchesPriceRange(product, min, max) {
  const v = product.priceValue
  if (typeof v !== 'number' || Number.isNaN(v)) return true
  return v >= min && v <= max
}

/**
 * Tính năng: nếu không chọn → bỏ qua.
 * Nếu chọn nhiều → AND: sản phẩm phải có đủ mọi tính năng đã chọn.
 */
export function productMatchesFeatures(product, selectedFeatureIds) {
  if (!selectedFeatureIds?.length) return true
  const set = new Set(product.featureIds ?? [])
  return selectedFeatureIds.every((id) => set.has(id))
}

/**
 * Pipeline lọc: áp dụng lần lượt query → category (OR) → khoảng giá → feature (AND).
 */
export function filterProducts(products, criteria) {
  const {
    query = '',
    categoryIds = [],
    priceMin = 0,
    priceMax = Number.POSITIVE_INFINITY,
    featureIds = [],
  } = criteria

  return products.filter(
    (p) =>
      productMatchesQuery(p, query) &&
      productMatchesCategories(p, categoryIds) &&
      productMatchesPriceRange(p, priceMin, priceMax) &&
      productMatchesFeatures(p, featureIds)
  )
}

const sortComparators = {
  /** Ưu tiên isNew, sau đó giữ thứ tự id tăng dần. */
  featured: (a, b) => {
    if (Boolean(a.isNew) !== Boolean(b.isNew)) return a.isNew ? -1 : 1
    return Number(a.id) - Number(b.id)
  },
  newest: (a, b) => Number(b.id) - Number(a.id),
  price_low: (a, b) => (a.priceValue || 0) - (b.priceValue || 0),
  price_high: (a, b) => (b.priceValue || 0) - (a.priceValue || 0),
}

export function sortProducts(products, sortKey) {
  const cmp = sortComparators[sortKey] || sortComparators.featured
  return [...products].sort(cmp)
}

/** Đếm số item theo categoryId (cho nhãn checkbox). */
export function countByCategory(products) {
  return products.reduce((acc, p) => {
    const k = p.categoryId
    if (k) acc[k] = (acc[k] || 0) + 1
    return acc
  }, {})
}
