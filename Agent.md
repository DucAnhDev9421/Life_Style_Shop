# Agent.md - Life Style Shop E-Commerce Platform

## Project Overview
**Life Style Shop** là một nền tảng thương mại điện tử hiện đại được xây dựng bằng các công nghệ web tiên tiến, cung cấp trải nghiệm người dùng tối ưu và quản lý backend mạnh mẽ.

---

## 📱 Frontend Architecture

### Framework & Library
- **Framework**: React (v18+)
- **State Management**: Redux Toolkit / Context API
- **HTTP Client**: Axios
- **Routing**: React Router v6

### Styling Solution
- **Tailwind CSS** - Utility-first CSS framework
  - Responsive design
  - Dark mode support
  - Custom theme configuration
  - Optimization với PurgeCSS

### UI Components
- **Ant Design (AntD)**
  - Pre-built, highly customizable components
  - Complete component library
  - Accessibility support (WCAG 2.1)
  - Components sử dụng:
    - Forms: Input, Select, DatePicker, Upload
    - Layout: Layout, Menu, Breadcrumb
    - Table: Table cho hiển thị dữ liệu sản phẩm
    - Modal, Drawer, Notification
    - Pagination, Carousel, Tree

### Key Frontend Features
```
/frontend
├── src/
│   ├── components/       # Reusable React components
│   ├── pages/           # Page components
│   ├── services/        # API calls (Axios instances)
│   ├── store/           # Redux store & slices
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions
│   ├── styles/          # Global Tailwind CSS
│   ├── assets/          # Images, icons
│   └── App.jsx
└── package.json
```

### Performance Optimization
- Code splitting with React.lazy()
- Image optimization with Cloudinary
- Lazy loading for components
- Bundle size optimization

---

## 🔧 Backend Architecture

### Framework & Runtime
- **Runtime**: Node.js (v16+)
- **Framework**: Express.js / Fastify
- **Environment**: Development, Staging, Production

### Backend API Structure
```
/backend
├── src/
│   ├── controllers/      # Business logic handlers
│   ├── routes/          # API endpoints
│   ├── models/          # MongoDB schemas & models
│   ├── middleware/      # Auth, validation, error handling
│   ├── services/        # Business logic services
│   ├── validators/      # Request validation (Joi, Zod)
│   ├── utils/           # Helper functions
│   ├── config/          # Configuration files
│   └── server.js        # Entry point
├── .env                 # Environment variables
└── package.json
```

### Core Backend Features
- RESTful API design
- Request validation & sanitization
- Error handling middleware
- CORS configuration
- Rate limiting
- Request logging

---

## 🔐 Authentication System

### JWT (JSON Web Token)
- **Access Token**: Short-lived (15 minutes)
- **Refresh Token**: Long-lived (7 days)
- **Token Storage**: HttpOnly cookies / LocalStorage

### Auth Flow
```
1. User Login/Register
   ↓
2. Server validates credentials
   ↓
3. Generate JWT tokens (Access + Refresh)
   ↓
4. Store tokens securely
   ↓
5. Include in API requests (Authorization header)
```

### Protected Routes
- Authentication middleware
- Role-based access control (RBAC)
- Permission checking
- Token verification & validation

### User Roles
- **Admin**: Full access to admin panel
- **Seller**: Manage products & orders
- **Customer**: Browse & purchase products
- **Guest**: Limited access

---

## 💾 Database

### MongoDB
- **Type**: NoSQL Document Database
- **Host**: MongoDB Atlas / Local MongoDB
- **Version**: 4.4+

### Database Collections
```
Collections:
├── users              # Customer & seller accounts
├── products           # Product catalog
├── categories         # Product categories
├── orders             # Order records
├── cart_items         # Shopping cart items
├── reviews            # Product reviews & ratings
├── payments           # Payment records
├── addresses          # Delivery addresses
├── coupons            # Discount codes
├── notifications      # User notifications
└── analytics          # Usage statistics
```

### MongoDB Features
- Indexing for performance
- Schema validation
- Data aggregation pipelines
- Transactions support

---

## ☁️ Cloud & External Services

### Cloudinary
- **Purpose**: Image & media management
- **Features**:
  - Product image uploads
  - Automatic image optimization
  - Image transformations (resize, crop, format)
  - CDN delivery for faster loading
  - Responsive image serving

### Image Upload Workflow
```
1. User selects image
2. Upload to Cloudinary via API
3. Get optimized URLs
4. Store URL in MongoDB
5. Display optimized images on frontend
```

---

## 🏗️ Project Architecture

### Complete Project Structure
```
Life_Style_Shop/
├── frontend/                    # React application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ShoppingCart.jsx
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── UserProfile.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── services/
│   │   │   ├── api.js           # Axios instance
│   │   │   ├── productService.js
│   │   │   ├── authService.js
│   │   │   └── orderService.js
│   │   ├── store/
│   │   │   ├── authSlice.js
│   │   │   ├── cartSlice.js
│   │   │   ├── productSlice.js
│   │   │   └── store.js
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── styles/
│   │   │   └── tailwind.css
│   │   ├── assets/
│   │   └── App.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js (or webpack.config.js)
│
├── backend/                     # Node.js application
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── productController.js
│   │   │   ├── orderController.js
│   │   │   └── userController.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── products.js
│   │   │   ├── orders.js
│   │   │   └── users.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Product.js
│   │   │   ├── Order.js
│   │   │   └── Review.js
│   │   ├── middleware/
│   │   │   ├── auth.js          # JWT verification
│   │   │   ├── errorHandler.js
│   │   │   └── validation.js
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── productService.js
│   │   │   └── orderService.js
│   │   ├── validators/
│   │   ├── config/
│   │   │   ├── database.js      # MongoDB connection
│   │   │   ├── cloudinary.js
│   │   │   └── jwt.js
│   │   ├── utils/
│   │   │   ├── logger.js
│   │   │   └── helpers.js
│   │   └── server.js
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── nodemon.json
│
├── Agent.md                     # This file
└── README.md
```

---

## 🚀 Core Features

### E-Commerce Functionality
- ✅ User Authentication & Authorization (JWT)
- ✅ Product Catalog & Search
- ✅ Shopping Cart Management
- ✅ Order Management
- ✅ Payment Processing
- ✅ Product Reviews & Ratings
- ✅ User Profile Management
- ✅ Wishlist / Favorites
- ✅ Order Tracking
- ✅ Admin Dashboard
- ✅ Inventory Management

### Frontend Features
- Responsive design (Mobile, Tablet, Desktop)
- Product filtering & sorting
- Image gallery with Cloudinary optimization
- Real-time notifications
- User dashboard
- Order history
- Search functionality

### Backend Features
- Secure API endpoints
- Input validation & sanitization
- Error handling & logging
- Rate limiting
- CRUD operations
- Aggregate data queries
- Email notifications

---

## 📋 API Endpoints

### Authentication
```
POST   /api/auth/register      # User registration
POST   /api/auth/login         # User login
POST   /api/auth/refresh       # Refresh token
POST   /api/auth/logout        # User logout
GET    /api/auth/verify        # Verify token
```

### Products
```
GET    /api/products           # Get all products
GET    /api/products/:id       # Get product details
POST   /api/products           # Create product (Admin)
PUT    /api/products/:id       # Update product (Admin)
DELETE /api/products/:id       # Delete product (Admin)
GET    /api/products/search    # Search products
```

### Orders
```
POST   /api/orders             # Create order
GET    /api/orders             # Get user orders
GET    /api/orders/:id         # Get order details
PUT    /api/orders/:id         # Update order status (Admin)
DELETE /api/orders/:id         # Cancel order
```

### Users
```
GET    /api/users/profile      # Get user profile
PUT    /api/users/profile      # Update profile
POST   /api/users/addresses    # Add address
GET    /api/users/addresses    # Get addresses
```

---

## 🔧 Environment Variables

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_APP_ENV=development
```

### Backend (.env)
```
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lifestyle_shop

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=15m
REFRESH_TOKEN_EXPIRE=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

---

## 💻 Development Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB account
- Cloudinary account

### Installation Steps

#### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

#### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your configuration
npm start
```

---

## 🧪 Testing & Deployment

### Frontend Testing
- Unit tests: Jest + React Testing Library
- E2E tests: Cypress / Playwright
- Build: `npm run build`
- Deploy: Vercel, Netlify, AWS S3

### Backend Testing
- Unit tests: Jest
- Integration tests: Supertest
- Load testing: Artillery

### Deployment Platforms
- Frontend: Vercel, Netlify, AWS Amplify
- Backend: Heroku, AWS EC2, DigitalOcean, Railway
- Database: MongoDB Atlas
- CDN: Cloudinary, CloudFlare

---

## 📊 Performance Optimization

### Frontend
- Code splitting & lazy loading
- Image optimization via Cloudinary
- Caching with Service Workers
- Bundle size monitoring
- CSS-in-JS optimization

### Backend
- Database indexing
- Query optimization
- Caching strategies (Redis)
- Load balancing
- API response compression (gzip)

---

## 🔒 Security Considerations

- ✅ HTTPS enforcement
- ✅ CORS configuration
- ✅ SQL/NoSQL injection prevention
- ✅ XSS protection
- ✅ CSRF tokens
- ✅ Secure password hashing (bcrypt)
- ✅ JWT token security
- ✅ Environment variable management
- ✅ Rate limiting
- ✅ Input validation & sanitization

---

## 🎨 Dev Standards & Design System

### "Tech Light" Aesthetic
All new UI components must strictly adhere to the following design language:
- **Primary Palette**: 
  - **Tech Blue**: `#0071e3` (Buttons, active states, accents)
  - **Surface**: `#fbfbfd` (Main background)
  - **Contrast Text**: `#1d1d1f` (Primary headings and body)
- **Typography**: Apple-style (San Francisco inspired). Use `Inter` or `-apple-system`.
- **Components**: 
  - Pill-shaped buttons (`borderRadius: 22px`).
  - Frosted glass effects (`backdrop-blur-md`) for overlays and badges.
  - Large, high-quality hardware-focused photography.
  - Generous whitespace and minimalist layout.

### Internationalization (i18n)
- **Framework**: `react-i18next`.
- **Mandatory Rule**: Never use hardcoded text strings in JSX.
- **Implementation**:
  - Always wrap text in `t('category.key')`.
  - Add new strings to `frontend/src/locales/en/translation.json` and `frontend/src/locales/vi/translation.json`.
  - Default language is English (`en`).

---

## 🤝 Team Collaboration

### Git Workflow
```
main (production)
  ├── develop (staging)
  │   ├── feature/user-auth
  │   ├── feature/product-listing
  │   └── bugfix/checkout-issue
```

### Naming Conventions
- Components: PascalCase (ProductCard.jsx)
- Functions: camelCase (handleSubmit)
- Constants: UPPER_SNAKE_CASE (API_BASE_URL)
- Branches: lowercase-with-dashes (feature/user-auth)

---

## 📝 Documentation Standards

- Code comments for complex logic
- README.md for each major folder
- API documentation (Swagger/OpenAPI)
- Architecture decision records (ADR)
- Setup guides for new developers

---

## 🎯 Next Steps

1. Set up development environment
2. Create frontend React structure
3. Create backend Express server
4. Connect to MongoDB
5. Implement authentication (JWT)
6. Integrate Cloudinary for images
7. Implement core features
8. Setup CI/CD pipeline
9. Deploy to production

---

**Last Updated**: March 2026
**Version**: 1.0.0
**Status**: Active Development
