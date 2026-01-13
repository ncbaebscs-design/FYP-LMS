# FYP-LMS (Final Year Project - Learning Management System)

A full-stack Learning Management System (LMS) designed for comprehensive course management, progress tracking, and interactive learning.

## 🚀 Features

- **User Authentication**: Secure Login and Signup using JWT.
- **Course Management**: Create, browse, and manage courses with ease.
- **Progress Tracking**: Track student progress through course modules.
- **Admin Panel**: Specialized interface for administrative tasks.
- **Instructor Dashboard**: Manage courses and student interactions for instructors.
- **Wishlist & Cart**: Seamless course enrollment and purchase flow.
- **Notifications**: Real-time updates and alerts for users.
- **Cloudinary Integration**: Effortless media (image/video) uploading and management.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS 4
- **Routing**: React Router Dom 7
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js
- **Framework**: Express 5
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT & Bcryptjs
- **Media Storage**: Cloudinary (via Multer)
- **Environment**: Dotenv

## 📂 Project Structure

```text
FYP-LMS/
├── client/          # Frontend application (React + Vite)
├── server/          # Backend API (Node.js + Express)
├── .gitignore       # Root git ignore configuration
└── README.md        # Project guide
```

## ⚙️ Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local instance or MongoDB Atlas)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd FYP-LMS
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` folder and add the following:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173

# Cloudinary Config
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
Run the server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../client
npm install
```
Run the frontend:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

---
Developed as a Final Year Project.
