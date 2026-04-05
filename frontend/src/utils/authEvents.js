/** Cùng tên sự kiện ở Login/Register/App để header cập nhật sau khi đăng nhập (cùng tab). */
export const AUTH_CHANGED_EVENT = 'lifestyle-auth-changed'

export function notifyAuthChanged() {
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT))
}
