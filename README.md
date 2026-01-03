# 🚚 Delivery — Courier Service Web Application

> A full-stack courier delivery platform built with the **MERN stack**, enabling users to securely send parcels, track deliveries, and make online payments with role-based access control.

**Development Period:** Nov 2025 – Dec 2025

---

## 🌐 Live Project Links

- **Live Application:** [https://delivery-app-e0827.web.app/](https://delivery-app-e0827.web.app/)
- **Backend API:** Deployed on Vercel

---

## 📸 Project Screenshot

![Delivery App Screenshot](./screenshot.png)
> *Add your application screenshot here*

---

## 📋 Project Overview

**Delivery** is a comprehensive courier service web application that streamlines parcel delivery management. Built with the MERN stack (MongoDB, Express.js, React.js, Node.js), it provides a seamless experience for users to send parcels, riders to manage deliveries, and administrators to oversee the entire operation. The platform features secure authentication, role-based access control, real-time tracking, and integrated payment processing via Stripe.

---

## 🛠️ Technologies Used

### **Frontend**
- **React 19** - UI library for building interactive interfaces
- **Vite** - Next-generation frontend build tool
- **React Router v7** - Client-side routing
- **TailwindCSS v4** & **DaisyUI** - Modern utility-first CSS framework
- **Material-UI (MUI)** - Comprehensive component library
- **Framer Motion** - Animation library
- **React Leaflet** - Interactive maps integration
- **Axios** - HTTP client for API requests
- **TanStack Query** - Data fetching and state management
- **React Hook Form** - Form validation and management
- **SweetAlert2** - Beautiful alert dialogs
- **Recharts** - Data visualization

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js v5** - Web application framework
- **MongoDB** - NoSQL database
- **Stripe** - Payment processing integration
- **Firebase Admin SDK** - Authentication and authorization
- **dotenv** - Environment variable management
- **CORS** - Cross-origin resource sharing

### **Authentication & Hosting**
- **Firebase Authentication** - Secure user authentication
- **Firebase Hosting** - Frontend deployment
- **Vercel** - Backend API deployment

---

## ✨ Core Features

### 🔐 **Authentication & Authorization**
- Secure user registration and login with Firebase Authentication
- Role-based access control (Admin, Rider, User)
- Protected routes for different user roles
- JWT token verification middleware

### 📦 **Parcel Management**
- Create and book parcel delivery requests
- Select pickup and delivery locations with interactive maps
- Real-time parcel tracking with unique tracking IDs
- View delivery history and status updates
- Filter and search parcels by status

### 🏍️ **Rider System**
- Rider registration and approval workflow
- Admin approval for new riders
- Assign parcels to available riders
- Rider dashboard to manage assigned deliveries
- Update delivery status in real-time

### 💳 **Payment Integration**
- Secure online payment processing with Stripe
- Payment history tracking
- Success confirmation pages
- Transaction records with timestamps

### 🧑‍💼 **Admin Dashboard**
- Comprehensive user management system
- Approve/reject rider applications
- Manage all parcels across the platform
- View statistics and analytics with charts
- Monitor platform activity

### 🎨 **User Experience**
- Responsive design for all devices
- Dark and light mode support
- Interactive maps for location selection (Leaflet)
- Beautiful animations and transitions
- Intuitive navigation and UI

---

## 📦 Dependencies

### Frontend Dependencies

```json
{
  "@emotion/react": "^11.14.0",
  "@emotion/styled": "^11.14.1",
  "@mui/material": "^7.3.5",
  "@mui/x-charts": "^8.19.0",
  "@mui/x-data-grid": "^8.19.0",
  "@tanstack/react-query": "^5.90.11",
  "axios": "^1.13.2",
  "firebase": "^12.6.0",
  "framer-motion": "^12.23.24",
  "leaflet": "^1.9.4",
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-hook-form": "^7.66.1",
  "react-leaflet": "^5.0.0-rc.2",
  "react-router": "^7.9.6",
  "recharts": "^3.4.1",
  "sweetalert2": "^11.26.3",
  "tailwindcss": "^4.1.17",
  "daisyui": "^5.5.5"
}
```

### Backend Dependencies

```json
{
  "express": "^5.1.0",
  "mongodb": "^7.0.0",
  "cors": "^2.8.5",
  "dotenv": "^17.2.3",
  "stripe": "^20.0.0",
  "firebase-admin": "^13.6.0",
  "nodemon": "^3.1.11"
}
```

---

## 🚀 Getting Started - Local Development Setup

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Atlas cloud)
- **Git**

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/delivery-app.git
cd delivery-app
```

### Step 2: Setup Environment Variables

#### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key

# Firebase Admin SDK (Base64 encoded service account key)
FB_SERVICE_KEY=your_base64_encoded_firebase_service_account

# Server Configuration
PORT=5000
```

#### Frontend Environment Variables

Create a `.env` file in the `Delivery` directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

# API URL
VITE_API_URL=http://localhost:5000
```

### Step 3: Install Dependencies

#### Install Backend Dependencies

```bash
cd backend
npm install
```

#### Install Frontend Dependencies

```bash
cd ../Delivery
npm install
```

### Step 4: Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable **Authentication** (Email/Password provider)
4. Download your Firebase service account key JSON file
5. Convert it to Base64 and add to backend `.env`
6. Copy your Firebase config to frontend `.env`

### Step 5: Configure Stripe

1. Sign up at [Stripe](https://stripe.com/)
2. Get your **Secret Key** from the Stripe Dashboard
3. Add it to your backend `.env` file

### Step 6: Setup MongoDB

**Option A: Local MongoDB**
```bash
# Start MongoDB service
mongod
```

**Option B: MongoDB Atlas**
1. Create a cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string
3. Add it to backend `.env`

### Step 7: Run the Application

#### Start Backend Server

```bash
cd backend
npm start
```
The backend will run on `http://localhost:5000`

#### Start Frontend Development Server

```bash
cd Delivery
npm run dev
```
The frontend will run on `http://localhost:5173`

### Step 8: Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

---

## 📁 Project Structure

```
Delivery/
├── backend/                    # Backend server
│   ├── index.js               # Express server and API routes
│   ├── convert.js             # Utility functions
│   ├── package.json           # Backend dependencies
│   └── .env                   # Backend environment variables
│
├── Delivery/                   # Frontend application
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── Components/        # React components
│   │   │   ├── Home/          # Home page
│   │   │   ├── Dashboard/     # User dashboard
│   │   │   ├── Login/         # Authentication
│   │   │   ├── Register/      # User registration
│   │   │   ├── AddAParcel/    # Parcel creation
│   │   │   ├── MyDashboard/   # User parcels & payments
│   │   │   ├── UsersManagement/ # Admin user management
│   │   │   └── ...
│   │   ├── Context/           # React context
│   │   ├── Hooks/             # Custom React hooks
│   │   ├── Provider/          # Context providers
│   │   ├── router/            # Route configuration
│   │   └── ...
│   ├── package.json           # Frontend dependencies
│   └── vite.config.js         # Vite configuration
│
└── README.md                   # Project documentation
```

---

## 🎯 User Roles

### **Regular User**
- Register and login
- Book parcel deliveries
- Track parcels
- Make payments
- View delivery history

### **Rider**
- Apply to become a rider
- Manage assigned deliveries
- Update delivery status
- View earnings

### **Admin**
- Manage all users
- Approve/reject rider applications
- Oversee all parcels
- View platform analytics
- Access complete system control

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👤 Author

**Ahmed**

---

## 🙏 Acknowledgments

- Firebase for authentication services
- Stripe for payment processing
- MongoDB for database solutions
- Material-UI for component library
- OpenStreetMap & Leaflet for mapping services

---

## 📞 Support

For support, email your-email@example.com or create an issue in the repository.

---

**⭐ If you find this project helpful, please give it a star!**
