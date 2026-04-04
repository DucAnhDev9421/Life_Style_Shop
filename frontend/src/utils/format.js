export function formatVnd(amount) {
  if (amount == null || Number.isNaN(Number(amount))) return '—'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(Number(amount))
}
