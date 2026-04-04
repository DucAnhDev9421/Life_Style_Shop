/**
 * Demo trang sản phẩm — dữ liệu mẫu (có thể thay bằng fetch API).
 * Query: ?id=1 để đổi sản phẩm (1–4).
 */
const CATALOG = [
  {
    id: 1,
    name: 'AirPods Max Pro',
    tagline: 'High-level ANC',
    price: '$549.00',
    isNew: true,
    description:
      'Tai nghe chụp tai cao cấp với chống ồn thích ứng và âm thanh không gian.',
    images: [
      'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
    specs: [
      { label: 'Chống ồn', value: 'Adaptive ANC' },
      { label: 'Pin', value: 'Đến 20 giờ' },
      { label: 'Chip', value: 'H2' },
    ],
  },
  {
    id: 2,
    name: 'Mechanical Keyboard X',
    tagline: 'Tactile Precision',
    price: '$199.00',
    isNew: true,
    description: 'Khung nhôm, switch xúc giác, kết nối USB-C và Bluetooth.',
    images: [
      'https://images.unsplash.com/photo-1595225476474-87563907a212?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
    specs: [
      { label: 'Switch', value: 'Tactile' },
      { label: 'Bố cục', value: '75%' },
    ],
  },
  {
    id: 3,
    name: 'Pro Display 32"',
    tagline: 'True Color Accuracy',
    price: '$1299.00',
    isNew: false,
    description: 'Màn hình 6K Retina cho công việc chỉnh màu chuyên nghiệp.',
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
    specs: [
      { label: 'Độ phân giải', value: '6K Retina' },
      { label: 'Độ sáng', value: '1000 nits' },
    ],
  },
  {
    id: 4,
    name: 'Smart Watch Gen 4',
    tagline: 'Track everything',
    price: '$399.00',
    isNew: false,
    description: 'Theo dõi sức khỏe, GPS và màn hình luôn bật.',
    images: [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
    specs: [
      { label: 'Chống nước', value: '50m' },
      { label: 'Cảm biến', value: 'HR, SpO₂, GPS' },
    ],
  },
]

function getProductFromQuery() {
  const params = new URLSearchParams(window.location.search)
  const id = Number(params.get('id')) || 1
  return CATALOG.find((p) => p.id === id) ?? CATALOG[0]
}

let activeIndex = 0
const product = getProductFromQuery()

const el = (id) => document.getElementById(id)

function render() {
  document.title = `${product.name} — Life Style Shop`
  el('breadcrumb-name').textContent = product.name
  el('product-title').textContent = product.name
  el('product-tagline').textContent = product.tagline
  el('product-price').textContent = product.price
  el('product-desc').textContent = product.description

  const badge = el('badge-new')
  badge.hidden = !product.isNew

  const mainImg = el('main-image')
  mainImg.src = product.images[activeIndex]
  mainImg.alt = product.name

  const thumbs = el('thumbs')
  thumbs.innerHTML = ''
  product.images.forEach((src, i) => {
    const b = document.createElement('button')
    b.type = 'button'
    b.setAttribute('role', 'tab')
    b.setAttribute('aria-selected', String(i === activeIndex))
    b.addEventListener('click', () => {
      activeIndex = i
      render()
    })
    const img = document.createElement('img')
    img.src = src
    img.alt = ''
    b.appendChild(img)
    thumbs.appendChild(b)
  })

  const specList = el('spec-list')
  specList.innerHTML = ''
  product.specs.forEach(({ label, value }) => {
    const row = document.createElement('div')
    row.className = 'row'
    row.innerHTML = `<dt>${label}</dt><dd>${value}</dd>`
    specList.appendChild(row)
  })
}

function showToast(message) {
  const t = el('toast')
  t.textContent = message
  t.hidden = false
  clearTimeout(showToast._timer)
  showToast._timer = setTimeout(() => {
    t.hidden = true
  }, 2200)
}

el('qty-minus').addEventListener('click', () => {
  const input = el('qty')
  const n = Math.max(1, Number(input.value) - 1)
  input.value = String(n)
})

el('qty-plus').addEventListener('click', () => {
  const input = el('qty')
  const n = Math.min(99, Number(input.value) + 1)
  input.value = String(n)
})

el('btn-cart').addEventListener('click', () => {
  const q = el('qty').value
  showToast(`Đã thêm ${q} × ${product.name} vào giỏ (demo).`)
})

el('btn-wishlist').addEventListener('click', () => {
  showToast('Đã lưu vào yêu thích (demo).')
})

render()
