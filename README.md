# 🍽️ SRCM Canteen - Campus Food Ordering System

A modern, full-stack web application for managing canteen orders at SRCM Campus, Tumukunta. Built with the MERN stack, featuring real-time order management, integrated payment gateway, and role-based access control.

[![Live Demo](https://img.shields.io/badge/Live-Demo-success?style=for-the-badge&logo=vercel)](https://srcm-canteen.vercel.app)
[![Backend API](https://img.shields.io/badge/Backend-API-blue?style=for-the-badge&logo=render)](https://srcm-canteen-backend.onrender.com)

---

## 🌐 Live Application

**Frontend:** [https://srcm-canteen.vercel.app](https://srcm-canteen.vercel.app)  
**Backend API:** [https://srcm-canteen-backend.onrender.com](https://srcm-canteen-backend.onrender.com)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### 🔐 Authentication

- **Google OAuth Integration** via Firebase
- Role-based access control (Student/Admin)
- Secure token-based authentication

### 🍕 Menu Management (Admin)

- Add, edit, and delete menu items
- Toggle availability status
- Category-based organization (Breakfast, Lunch, Snacks, Dinner, Drinks)
- Image upload support

### 🛒 Order Management

**For Students:**

- Browse available menu items
- Add items to cart with quantity selection
- Choose delivery option (Delivery, Takeaway, Dine-in)
- Integrated Razorpay payment gateway
- View active orders and order history
- Real-time order status tracking (Pending → Preparing → Ready → Delivered)

**For Admins:**

- View all orders in real-time
- Split dashboard (Active Orders | Ready Orders)
- Update order status
- Auto-cleanup: Orders in "Ready" status for 20+ minutes automatically marked as "Delivered"
- Complete order details with delivery options

### 💰 Payment Integration

- **Razorpay** payment gateway
- Support for online payments
- Secure payment verification
- Test and Live mode support

### 📱 User Experience

- Responsive design (Mobile, Tablet, Desktop)
- Modern UI with Tailwind CSS
- Real-time updates
- Toast notifications
- Loading states and error handling

---

## 🛠️ Tech Stack

### Frontend

- **React** (Vite)
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Firebase Auth** - Google Sign-In
- **Razorpay Checkout** - Payment processing

### Backend

- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** (Atlas) - Database
- **Mongoose** - ODM
- **Firebase Admin SDK** - Authentication verification
- **Razorpay SDK** - Payment processing
- **CORS** - Cross-origin requests

### Deployment

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas

---

## 📁 Project Structure

```
SRCM-Canteen/
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── admin/      # Admin-specific components
│   │   │   ├── Navbar.jsx
│   │   │   └── AccessDenied.jsx
│   │   ├── context/        # React Context (Auth, Cart)
│   │   ├── pages/          # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Menu.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Admin.jsx
│   │   │   └── Login.jsx
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── public/
│   ├── vercel.json         # Vercel configuration
│   └── package.json
│
├── server/                 # Backend (Node.js + Express)
│   ├── config/
│   │   └── firebase.js     # Firebase Admin SDK setup
│   ├── controllers/        # Business logic
│   │   ├── authController.js
│   │   ├── menuController.js
│   │   └── orderController.js
│   ├── models/             # Mongoose schemas
│   │   ├── User.js
│   │   ├── MenuItem.js
│   │   └── Order.js
│   ├── routes/             # API routes
│   │   ├── authRoutes.js
│   │   ├── menuRoutes.js
│   │   └── orderRoutes.js
│   ├── middleware/         # Custom middleware
│   │   ├── authMiddleware.js
│   │   └── adminMiddleware.js
│   ├── server.js           # Entry point
│   ├── render.yaml         # Render configuration
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** account (Atlas)
- **Firebase** project (for authentication)
- **Razorpay** account (for payments)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/gnutulapati/Canteen-System.git
   cd Canteen-System
   ```

2. **Install dependencies**

   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. **Set up environment variables** (see [Environment Variables](#environment-variables))

4. **Run the application**

   ```bash
   # Start backend (from server folder)
   cd server
   npm run dev

   # Start frontend (from client folder, in new terminal)
   cd client
   npm run dev
   ```

5. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:5000`

---

## 🔐 Environment Variables

### Backend (`server/.env`)

```env
# Database
DB_USERNAME=your_mongodb_username
DB_PASSWORD=your_mongodb_password

# Server
PORT=5000
NODE_ENV=development

# Firebase
FIREBASE_SERVICE_ACCOUNT_KEY=./config/service-account.json
# OR for deployment:
FIREBASE_SERVICE_ACCOUNT_BASE64=your_base64_encoded_service_account

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
```

### Frontend (`client/.env`)

```env
# Backend API
VITE_API_URL=http://localhost:5000/api

# Razorpay (Key ID only - NOT secret!)
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

---

## 🌐 Deployment

### Backend (Render)

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect repository
4. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Root Directory:** `server`
5. Add environment variables
6. Deploy!

**Detailed Guide:** See `README_DEPLOY_BACKEND.md`

### Frontend (Vercel)

1. Connect GitHub repository to Vercel
2. Configure:
   - **Framework:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Root Directory:** `client`
3. Add environment variables
4. Deploy!

**Detailed Guide:** See `README_DEPLOY_FRONTEND.md`

---

## 📖 Usage

### For Students

1. **Sign In** with Google account
2. **Browse Menu** - View available items by category
3. **Add to Cart** - Select items and quantities
4. **Checkout** - Choose delivery option (Delivery/Takeaway/Dine-in)
5. **Pay** - Complete payment via Razorpay
6. **Track Order** - Monitor order status in Orders page
7. **View History** - Check past orders in Profile

### For Admins

1. **Sign In** with admin Google account
2. **Dashboard** - Access admin-only dashboard
3. **Manage Menu:**
   - Add new items
   - Edit existing items
   - Toggle availability
   - Delete items
4. **Manage Orders:**
   - View all orders
   - Update order status (Pending → Preparing → Ready → Delivered)
   - Auto-cleanup for old "Ready" orders

---

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/google-login` - Google OAuth login

### Menu

- `GET /api/menu` - Get all menu items (public)
- `GET /api/menu/all` - Get all items (admin)
- `POST /api/menu` - Add menu item (admin)
- `PUT /api/menu/:id` - Update menu item (admin)
- `PATCH /api/menu/:id/availability` - Toggle availability (admin)
- `DELETE /api/menu/:id` - Delete menu item (admin)

### Orders

- `POST /api/orders/create-razorpay-order` - Create Razorpay order
- `POST /api/orders` - Create order after payment
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/all` - Get all orders (admin)
- `GET /api/orders/:id` - Get single order
- `PATCH /api/orders/:id/status` - Update order status (admin)
- `POST /api/orders/cleanup-ready` - Auto-cleanup ready orders (admin)

---

## 👥 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Gourav Nutulapati**  
GitHub: [@gnutulapati](https://github.com/gnutulapati)

---

## 🙏 Acknowledgments

- SRCM Campus, Tumukunta
- Firebase for authentication
- Razorpay for payment processing
- MongoDB Atlas for database hosting
- Vercel & Render for deployment

---

## 📞 Support

For issues or questions, please open an issue on GitHub or contact the development team.

---

**⭐ If you found this project useful, please give it a star!**
