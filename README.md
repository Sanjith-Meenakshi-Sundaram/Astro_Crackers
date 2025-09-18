# Astro Crackers 🎆

A modern, full-stack e-commerce website for selling crackers online. Built with React.js frontend and Node.js/Express backend with MongoDB database. Features include product browsing, cart management, order processing via email, and admin panel for inventory management.

## Tech Stack 🛠️

| Technology | Tech Stack | Version |
|------------|------------|---------|
| **Frontend** | ![React](https://img.shields.io/badge/REACT-61DAFB?style=for-the-badge&logo=react&logoColor=black) | 18.2.0 |
| **Backend** | ![Node.js](https://img.shields.io/badge/NODE.JS-339933?style=for-the-badge&logo=node.js&logoColor=white) | 20.11.1 |
| **Database** | ![MongoDB](https://img.shields.io/badge/MONGODB-47A248?style=for-the-badge&logo=mongodb&logoColor=white) | Atlas |
| **Build Tool** | ![Vite](https://img.shields.io/badge/VITE-646CFF?style=for-the-badge&logo=vite&logoColor=white) | Latest |
| **Styling** | ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) | Latest |

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

## 📁 Project Structure

```
CRACKERS/
├── frontend/                   # React frontend application
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   │   ├── common/        # Shared components (Navbar, ProductCard, etc.)
│   │   │   ├── auth/          # Authentication components
│   │   │   ├── products/      # Product-related components
│   │   │   ├── cart/          # Shopping cart components
│   │   │   ├── profile/       # User profile components
│   │   │   ├── owner/         # Admin panel components
│   │   │   └── help/          # Help and support components
│   │   ├── pages/            # Page components
│   │   ├── context/          # React Context providers
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API service functions
│   │   ├── styles/           # CSS stylesheets
│   │   ├── utils/            # Utility functions
│   │   ├── App.jsx           # Main app component
│   │   └── main.jsx          # React entry point
│   ├── package.json
│   └── vite.config.js
├── backend/                   # Express.js backend application
│   ├── config/               # Configuration files
│   │   ├── database.js       # MongoDB connection
│   │   └── nodemailer.js     # Email configuration
│   ├── controllers/          # Route controllers
│   │   ├── authController.js      # User authentication
│   │   ├── productController.js   # Product operations
│   │   ├── categoryController.js  # Category management
│   │   ├── cartController.js      # Shopping cart
│   │   ├── orderController.js     # Order processing
│   │   └── adminController.js     # Admin operations
│   ├── middleware/           # Custom middleware
│   │   ├── auth.js           # Authentication middleware
│   │   └── ownerAuth.js      # Admin authorization
│   ├── models/              # Mongoose schemas
│   │   ├── User.js          # User data model
│   │   ├── Product.js       # Product data model
│   │   ├── Category.js      # Category data model
│   │   ├── Cart.js          # Shopping cart model
│   │   └── Order.js         # Order data model
│   ├── routes/              # Express routes
│   │   ├── auth.js          # Authentication routes
│   │   ├── products.js      # Product routes
│   │   ├── categories.js    # Category routes
│   │   ├── cart.js          # Cart routes
│   │   ├── orders.js        # Order routes
│   │   └── owner.js         # Admin routes
│   ├── utils/               # Utility functions
│   │   ├── emailService.js  # Email templates and sending
│   │   └── validators.js    # Input validation
│   ├── .env                 # Environment variables
│   ├── package.json
│   └── server.js           # Express server entry point
└── README.md               # Project documentation
```

## 🚦 Getting Started

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v20.11.1 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Gmail account** (for email service)

### Installation & Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/your-username/astro-crackers.git
cd astro-crackers
```

#### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

#### 3. Configure Environment Variables
Edit the `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/crackers-store
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/crackers-store

# JWT Secret (Generate a strong secret key)
JWT_SECRET=your-super-secret-jwt-key-here

# Admin Credentials
ADMIN_EMAIL=your-admin-email@gmail.com
ADMIN_PASSWORD=your-admin-password

# Gmail Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password

# Optional: WhatsApp Integration
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
WHATSAPP_ACCESS_TOKEN=your-access-token
```

#### 4. Gmail App Password Setup
1. Go to [Google App Passwords](https://accounts.google.com/apppasswords)
2. Generate a new app password for "Mail"
3. Use this password in the `EMAIL_PASS` field

#### 5. Start Backend Server
```bash
# In backend directory
npm start

# For development with auto-restart
npm run dev
```

#### 6. Frontend Setup
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

#### 7. Access the Application
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

The application uses **Nodemailer** with Gmail SMTP to send order confirmations. When a customer places an order:

1. **Customer receives**: Order confirmation with details
2. **Admin receives**: New order notification
3. **Professional formatting**: Includes order ID, customer details, and product list

### Sample Email Template
```
Thank you for your order! 🎆

Order #AC202412001 has been successfully received.

Order Details:
- Product 1: Quantity × Price
- Product 2: Quantity × Price

Total: ₹XXX

Our team will contact you within 24 hours to confirm delivery details.

For queries, call us at +91-XXXXX-XXXXX

- Astro Crackers Team
```

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

## 🚀 Deployment

### Production Build

#### Frontend
```bash
cd frontend
npm run build
```

#### Backend
```bash
cd backend
npm start
```

### Environment Setup for Production
1. Update `NODE_ENV=production` in `.env`
2. Use production MongoDB URI
3. Configure production email credentials
4. Set secure JWT secret

### Recommended Hosting
- **Frontend**: Vercel, Netlify, or GitHub Pages
- **Backend**: Heroku, Railway, or DigitalOcean
- **Database**: MongoDB Atlas (cloud)

## 🧪 Testing

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 📞 Support & Contact

- **Email**: support@astrocrackers.com
- **Phone**: +91-XXXXX-XXXXX
- **Issues**: [GitHub Issues](https://github.com/your-username/astro-crackers/issues)

## 🔄 Future Enhancements

- [ ] **Payment Integration** (Razorpay/Stripe)
- [ ] **WhatsApp Order Notifications**
- [ ] **Inventory Management System**
- [ ] **Order Tracking with SMS**
- [ ] **Product Reviews & Ratings**
- [ ] **Wishlist Functionality**
- [ ] **Multi-language Support**
- [ ] **PWA (Progressive Web App)**

---

**Built with ❤️ for Astro Crackers** 🎆
