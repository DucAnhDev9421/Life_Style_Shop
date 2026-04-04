import api from './api'

export async function fetchWishlist() {
  const { data } = await api.get('/wishlist')
  return data
}

export async function addWishlistItem(payload) {
  const { data } = await api.post('/wishlist/items', payload)
  return data
}

export async function updateWishlistItemNote(productId, note) {
  const { data } = await api.patch(`/wishlist/items/${productId}`, { note })
  return data
}

export async function removeWishlistItem(productId) {
  const { data } = await api.delete(`/wishlist/items/${productId}`)
  return data
}

export async function clearWishlist() {
  const { data } = await api.delete('/wishlist')
  return data
}
