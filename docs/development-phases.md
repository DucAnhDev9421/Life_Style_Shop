# Quy trình Phát triển Dự án E-commerce (Life Style Shop)

Tài liệu này mô tả các giai đoạn phát triển dự án Thương mại điện tử Life Style Shop. Dự án được chia thành 6 giai đoạn chính, mỗi giai đoạn do một thành viên trong nhóm chịu trách nhiệm code chính (Lead Developer) để đảm bảo tính nhất quán và quản lý tiến độ hiệu quả.

---

## 👥 Danh sách Nhóm (6 Thành viên)

1. **Thành viên 1**: Team Leader / Lead Backend foundation
2. **Thành viên 2**: Backend Developer (Catalog & Search)
3. **Thành viên 3**: Frontend Developer (UI/UX & Cart)
4. **Thành viên 4**: Fullstack Developer (Order & Checkout)
5. **Thành viên 5**: Integration Specialist (Payment & Inventory)
6. **Thành viên 6**: Admin Dashboard & DevOps

---

## 🚀 Các Giai đoạn Phát triển (Phases)

### Giai đoạn 1: Khởi tạo Project & Xác thực (Authentication)
*   **Người thực hiện**: Thành viên 1
*   **Nội dung công việc**:
    *   Thiết lập cấu trúc thư mục `frontend/` và `backend/`.
    *   Cấu hình ESLint, Prettier, Git Convention.
    *   Thiết kế Database Schema (User, Token).
    *   Xây dựng hệ thống Đăng ký, Đăng nhập (JWT + Refresh Token).
    *   Middleware phân quyền (RBAC - Role Based Access Control).
*   **Kết quả**: Hệ thống login/logout hoạt động ổn định, phân quyền Admin/User rõ ràng.

### Giai đoạn 2: Danh mục Sản phẩm & Tìm kiếm (Catalog)
*   **Người thực hiện**: Thành viên 2
*   **Nội dung công việc**:
    *   Xây dựng API CRUD Sản phẩm (Products) và Danh mục (Categories).
    *   Thiết kế giao diện Trang chủ (`Home`) và Danh sách sản phẩm (`Product List`).
    *   Xây dựng bộ lọc (Filter) theo giá, thương hiệu, danh mục.
    *   Hệ thống tìm kiếm (Search) cơ bản và gợi ý sản phẩm.
    *   Trình diễn chi tiết sản phẩm (`Product Detail`).
*   **Kết quả**: Người dùng có thể xem, tìm kiếm và lọc sản phẩm mượt mà.

### Giai đoạn 3: Giỏ hàng & Trang cá nhân (Cart & Profile)
*   **Người thực hiện**: Thành viên 3
*   **Nội dung công việc**:
    *   Xây dựng logic Giỏ hàng (Thêm/Xóa/Sửa số lượng) ở cả FE (Redux) và BE (Database).
    *   Xây dựng trang Dashboard của người dùng (Thông tin cá nhân, Đổi mật khẩu).
    *   Quản lý danh sách địa chỉ nhận hàng (Shipping Addresses).
    *   Hệ thống Yêu thích (Wishlist).
*   **Kết quả**: Luồng chuẩn bị mua hàng hoàn thiện, dữ liệu đồng bộ giữa Client và Server.

### Giai đoạn 4: Đặt hàng & Quy trình Thanh toán (Checkout)
*   **Người thực hiện**: Thành viên 4
*   **Nội dung công việc**:
    *   Xây dựng luồng Checkout (Chọn địa chỉ -> Chọn phương thức vận chuyển -> Tổng kết đơn hàng).
    *   Xây dựng Model Order và logic tạo đơn hàng.
    *   Xử lý logic tính giá, thuế, phí vận chuyển và áp dụng mã giảm giá (Coupon).
    *   API quản lý Lịch sử đơn hàng (Order History).
*   **Kết quả**: Người dùng có thể tiến hành đặt đơn hàng thành công.

### Giai đoạn 5: Tích hợp Thanh toán & Kho hàng (Payment & Inventory)
*   **Người thực hiện**: Thành viên 5
*   **Nội dung công việc**:
    *   Tích hợp cổng thanh toán (VNPAY, MoMo hoặc Stripe).
    *   Xử lý Webhook để cập nhật trạng thái đơn hàng tự động.
    *   Quản lý tồn kho (Stock management): Trừ kho khi đặt hàng, cộng kho khi hủy đơn.
    *   Hệ thống Đánh giá/Nhận xét (Reviews & Ratings) sau khi mua hàng.
*   **Kết quả**: Quy trình thanh toán an toàn, kho hàng được kiểm soát tránh overselling.

### Giai đoạn 6: Quản trị & Triển khai (Admin CMS & Deployment)
*   **Người thực hiện**: Thành viên 6
*   **Nội dung công việc**:
    *   Xây dựng Admin Dashboard quản lý tổng quan (Doanh thu, Đơn hàng mới).
    *   CRUD Người dùng, Sản phẩm, Danh mục dành cho Admin.
    *   Quản lý trạng thái đơn hàng (Duyệt đơn, Đang giao, Đã giao).
    *   Cấu hình CI/CD (GitHub Actions) và Deploy lên hosting (Vercel/Render/DigitalOcean).
    *   Tối ưu SEO và Performance.
*   **Kết quả**: Hệ thống sẵn sàng vận hành thực tế.

---

## 🛠 Công nghệ Sử dụng

*   **Frontend**: React.js, Tailwind CSS, Redux Toolkit, Vite.
*   **Backend**: Node.js, Express.js.
*   **Database**: MongoDB (Mongoose).
*   **Tools**: Postman, Git, Trello/Jira (Quản lý task).

---

## 📈 Quy trình Phối hợp
1.  **Daily Standup**: Họp 15p mỗi ngày để báo cáo tiến độ và khó khăn.
2.  **Code Review**: Ít nhất 1 thành viên khác review Code trước khi Merge vào nhánh `main`.
3.  **Testing**: Mỗi giai đoạn hoàn thành cần pass Unit Test và Manual Test trên Staging.
