import axios from 'axios'
import { notifyAuthChanged } from '../utils/authEvents'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const getProducts = async (params = {}) => {
  const response = await api.get('/products', { params })
  return response.data
}

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`)
  return response.data
}

export const getCategories = async () => {
  const response = await api.get('/categories')
  return response.data
}
/**
 * Gắn JWT (nhánh xác thực) vào mọi request — cart / orders / profile đều dùng chung instance này.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

/**
 * 401: token hết hạn / không hợp lệ — xóa session local để header & luồng login đồng bộ.
 * (Refresh token: mở rộng tại đây khi backend hỗ trợ.)
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    if (status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      notifyAuthChanged()
    }
    return Promise.reject(error)
  },
)

export default api
