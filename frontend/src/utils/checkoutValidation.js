/**
 * Chuẩn hóa SĐT VN: bỏ khoảng trắng, dấu chấm/gạch trước khi test regex.
 */
export function normalizeVnPhone(raw) {
  return String(raw || '')
    .trim()
    .replace(/[\s.-]/g, '')
}

/**
 * SĐT VN: 10 số bắt đầu 03/05/07/08/09 hoặc +84 / 84 + 9 số.
 */
export function isValidVnPhone(normalized) {
  if (!normalized) return false
  if (/^0[35789]\d{8}$/.test(normalized)) return true
  if (/^(\+84|84)(3|5|7|8|9)\d{8}$/.test(normalized)) return true
  return false
}

export function isValidEmailOptional(value) {
  const s = String(value || '').trim()
  if (!s) return true
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
}

/**
 * Trả về object lỗi theo từng field; key không có nghĩa hợp lệ.
 */
export function validateCheckoutShipping(form) {
  const errors = {}
  const fullName = String(form.fullName || '').trim()
  if (!fullName) errors.fullName = 'required'

  const phoneNorm = normalizeVnPhone(form.phone)
  if (!phoneNorm) errors.phone = 'required'
  else if (!isValidVnPhone(phoneNorm)) errors.phone = 'invalid'

  const address = String(form.address || '').trim()
  if (!address) errors.address = 'required'

  if (!isValidEmailOptional(form.email)) errors.email = 'invalid'

  return errors
}
