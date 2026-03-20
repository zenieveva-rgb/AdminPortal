# SecretaryWeb Admin Portal

Complete admin management system for SecretaryWeb QR Scanner with Firebase Realtime Database.

## Features

- 🔐 Secure admin authentication
- 👥 User approval/block system
- 📊 Real-time statistics dashboard
- 🔍 Search and filter users
- 📱 Responsive design
- 🔔 Toast notifications
- ⚡ Firebase 9.17.1 (modular SDK)

## Setup Instructions

### 1. Firebase Configuration

Replace the placeholder config in `admin.js` with your actual Firebase credentials:

```javascript
const firebaseConfig = {
    apiKey: "your-actual-api-key",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project-default-rtdb.firebaseio.com",
    projectId: "your-project",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
};
