/** Curated catalog — dùng cho trang chủ và trang chi tiết */
export const PRODUCTS = [
  {
    id: 1,
    name: 'AirPods Max Pro',
    tagline: 'High-level ANC',
    price: '$549.00',
    image:
      'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
    isNew: true,
    descriptionKey: 'productDetail.descriptions.1',
    specs: [
      { labelKey: 'productDetail.specs.active_noise', value: 'Adaptive ANC' },
      { labelKey: 'productDetail.specs.battery', value: 'Up to 20h' },
      { labelKey: 'productDetail.specs.chip', value: 'H2' },
    ],
  },
  {
    id: 2,
    name: 'Mechanical Keyboard X',
    tagline: 'Tactile Precision',
    price: '$199.00',
    image:
      'https://images.unsplash.com/photo-1595225476474-87563907a212?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1595225476474-87563907a212?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511467687858-23d96c32e911?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
    isNew: true,
    descriptionKey: 'productDetail.descriptions.2',
    specs: [
      { labelKey: 'productDetail.specs.switches', value: 'Tactile' },
      { labelKey: 'productDetail.specs.layout', value: '75%' },
      { labelKey: 'productDetail.specs.connectivity', value: 'USB-C / BT 5.2' },
    ],
  },
  {
    id: 3,
    name: 'Pro Display 32"',
    tagline: 'True Color Accuracy',
    price: '$1299.00',
    image:
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
    isNew: false,
    descriptionKey: 'productDetail.descriptions.3',
    specs: [
      { labelKey: 'productDetail.specs.resolution', value: '6K Retina' },
      { labelKey: 'productDetail.specs.brightness', value: '1000 nits' },
      { labelKey: 'productDetail.specs.ports', value: 'Thunderbolt 3' },
    ],
  },
  {
    id: 4,
    name: 'Smart Watch Gen 4',
    tagline: 'Track everything',
    price: '$399.00',
    image:
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
    isNew: false,
    descriptionKey: 'productDetail.descriptions.4',
    specs: [
      { labelKey: 'productDetail.specs.display_watch', value: 'Always-On' },
      { labelKey: 'productDetail.specs.water', value: '50m' },
      { labelKey: 'productDetail.specs.sensors', value: 'HR, SpO₂, GPS' },
    ],
  },
]

export function getProductById(id) {
  const n = Number(id)
  return PRODUCTS.find((p) => p.id === n) ?? null
}
