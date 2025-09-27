# Astro Crackers 🎆

A modern, full-stack e-commerce website for selling crackers online. Built with React.js frontend and Node.js/Express backend with MongoDB database. Features include product browsing, cart management, order processing via email, and admin panel for inventory management.

#### Order Crackers➡: https://astro-crackers-sivakasi.vercel.app/

## Tech Stack 🛠

| Technology | Tech Stack | Version |
|------------|------------|---------|
| **Frontend** | ![React](https://img.shields.io/badge/REACT-61DAFB?style=for-the-badge&logo=react&logoColor=black) | 18.2.0 |
| **Backend** | ![Node.js](https://img.shields.io/badge/NODE.JS-339933?style=for-the-badge&logo=node.js&logoColor=white) | 20.11.1 |
| **Database** | ![MongoDB](https://img.shields.io/badge/MONGODB-47A248?style=for-the-badge&logo=mongodb&logoColor=white) | Atlas |
| **Build Tool** | ![Vite](https://img.shields.io/badge/VITE-646CFF?style=for-the-badge&logo=vite&logoColor=white) | Latest |
| **Styling** | ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white) | Latest |
| **Email API** | ![Brevo](https://img.shields.io/badge/Brevo-FF6B6B?style=for-the-badge&logo=sendinblue&logoColor=white) | Latest |

## 🚀 Features

### Customer Features
- **Product Catalog**: Browse crackers by categories (Night crackers, Morning crackers, etc.)
- **Search Functionality**: Find products quickly with smart search
- **Shopping Cart**: Add/remove items, view cart summary
- **Order Management**: Place orders without payment integration
- **Email Notifications**: Receive order confirmations via email
- **Responsive Design**: Works seamlessly on desktop and mobile
- **User Authentication**: Secure login/signup system
- **Profile Management**: Update personal information and addresses

### Admin Features
- **Product Management**: CRUD operations for products
- **Category Management**: Manage product categories
- **Order Management**: View and manage all customer orders
- **Inventory Control**: Update stock levels and product details
- **Image Management**: Upload multiple product images

## 🔧 Additional Technologies

### Frontend Dependencies
- **Axios** - HTTP client for API calls
- **React Router** - Client-side routing and navigation
- **React Context** - State management for auth, cart, and products

### Backend Dependencies
- **Express.js** - Web application framework
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Nodemailer** - Email sending service
- **Bcrypt** - Password hashing and security

#### Gmail App Password Setup
1. Go to [Google App Passwords](https://accounts.google.com/apppasswords)
2. Generate a new app password for "Mail"

#### Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 📡 API Endpoints

### Authentication Routes
```
POST /api/auth/register     # User registration
POST /api/auth/login        # User login
GET  /api/auth/profile      # Get user profile
PUT  /api/auth/profile      # Update user profile
```

### Product Routes
```
GET    /api/products           # Get all products
GET    /api/products/:id       # Get single product
GET    /api/products/search    # Search products
GET    /api/products/category/:categoryId  # Get products by category
```

### Category Routes
```
GET /api/categories     # Get all categories
```

### Cart Routes
```
GET    /api/cart           # Get user cart
POST   /api/cart/add       # Add item to cart
PUT    /api/cart/update    # Update cart item quantity
DELETE /api/cart/remove    # Remove item from cart
DELETE /api/cart/clear     # Clear entire cart
```

### Order Routes
```
POST /api/orders/place     # Place new order
GET  /api/orders/user      # Get user orders
```

### Admin Routes (Owner Only)
```
POST   /api/owner/products     # Create new product
PUT    /api/owner/products/:id # Update product
DELETE /api/owner/products/:id # Delete product
POST   /api/owner/categories   # Create category
GET    /api/owner/orders       # Get all orders
```

## 📧 Email Service

The application uses Brevo API to send order confirmations. When a customer places an order:

1. **Customer receives**: Order confirmation with details
2. **Admin receives**: New order notification
3. **Professional formatting**: Includes order ID, customer details, and product list

## 🔐 Authentication & Security

### JWT Authentication
- **Secure token-based authentication**
- **Auto-expiry**: Tokens expire after 30 days
- **Route protection**: Private routes require valid tokens

### Password Security
- **Bcrypt hashing**: Passwords are hashed with salt rounds
- **Secure validation**: Strong password requirements

### Admin Authorization
- **Role-based access**: Owner-only routes protected
- **Middleware validation**: Admin operations require special permissions

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured interface
- **Tablet**: Adapted layouts and touch-friendly
- **Mobile**: Bottom navigation, simplified UI

### Key Responsive Features
- **Mobile-first design approach**
- **Touch-friendly buttons and navigation**
- **Optimized image loading**
- **Responsive grid layouts**

## 🎨 UI/UX Features

### Navigation
- **Top Navbar**: Logo, search bar, user profile
- **Bottom Mobile Nav**: Home, Search, Cart (mobile only)
- **Breadcrumb navigation** for easy navigation

### Product Display
- **Grid layout**: 4 products per row (desktop), responsive
- **Image gallery**: Multiple product images with zoom
- **Quick actions**: Add to cart, view details

### Shopping Experience
- **Real-time cart updates**
- **Product search with filters**
- **Category-based browsing**
- **Order tracking and history**

## 📋 Usage Guide

### For Customers
1. **Browse Products**: View all available crackers
2. **Search**: Find specific products quickly
3. **Add to Cart**: Select products and quantities
4. **Place Order**: Provide delivery details
5. **Receive Confirmation**: Get email confirmation

### For Admin/Owner
1. **Access Admin Panel**: Login with admin credentials
2. **Manage Products**: Add, edit, or remove products
3. **Manage Categories**: Organize product categories
4. **View Orders**: Monitor all customer orders
5. **Update Inventory**: Keep stock levels current

## 📞 Support & Contact

- **Email**: crackers.astro@gmail.com
- **Phone**: +91-8300372046

## 🔄 Future Enhancements

- [ ] **Payment Integration** (Razorpay/Stripe)
- [ ] **WhatsApp Order Notifications**
