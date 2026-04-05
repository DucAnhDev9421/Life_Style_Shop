import api from './api'

export const adminApi = {
  getStats: async () => {
    const response = await api.get('/admin/stats')
    return response.data
  },

  getAnalytics: async () => {
    const response = await api.get('/admin/analytics')
    return response.data
  },

  // Products
  getProducts: async (params = {}) => {
    const response = await api.get('/admin/products', { params })
    return response.data
  },
  createProduct: async (data) => {
    const response = await api.post('/admin/products', data)
    return response.data
  },
  updateProduct: async (id, data) => {
    const response = await api.patch(`/admin/products/${id}`, data)
    return response.data
  },
  updateProductStatus: async (id, status) => {
    const response = await api.patch(`/admin/products/${id}/status`, { status })
    return response.data
  },
  deleteProduct: async (id) => {
    const response = await api.delete(`/admin/products/${id}`)
    return response.data
  },

  // Users
  getUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params })
    return response.data
  },
  updateUserStatus: async (id, status) => {
    const response = await api.patch(`/admin/users/${id}/status`, { status })
    return response.data
  },

  // Categories
  getCategories: async () => {
    const response = await api.get('/admin/categories')
    return response.data
  },
  createCategory: async (data) => {
    const response = await api.post('/categories', data)
    return response.data
  },
  updateCategory: async (id, data) => {
    const response = await api.put(`/categories/${id}`, data)
    return response.data
  },
  deleteCategory: async (id) => {
    const response = await api.delete(`/admin/categories/${id}`)
    return response.data
  },
}
