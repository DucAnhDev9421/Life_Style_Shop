/** Định dạng số tiền VND theo locale (Figma LifeStyle Shop). */
export function formatVndAmount(amount, locale) {
  const n = Number(amount)
  if (!Number.isFinite(n)) return ''
  const isVi = String(locale || '').toLowerCase().startsWith('vi')
  const withDots = n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return isVi ? `${withDots} VNĐ` : `${n.toLocaleString('en-US')} VND`
}
