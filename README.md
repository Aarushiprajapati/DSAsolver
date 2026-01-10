# DSASolver - Master Data Structures & Algorithms

A premium, full-featured DSA practice platform built with React, featuring daily practice tracking, performance analytics, and an integrated code editor.

![DSASolver Platform](https://img.shields.io/badge/Status-Production%20Ready-success)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![Vite](https://img.shields.io/badge/Vite-7.2.4-purple)

## 🚀 Features

### Core Functionality
- **500+ Curated Problems** - Organized by topic and difficulty
- **Premium Code Editor** - Monaco Editor with syntax highlighting and autocomplete
- **Multi-Language Support** - JavaScript, Python, and Java
- **Instant Feedback** - Real-time code execution with detailed test results
- **Smart Filtering** - Search and filter problems by difficulty, category, and tags

### Daily Practice & Analytics
- **🔥 Streak Tracking** - Build consistency with daily streak counters
- **📊 Activity Heatmap** - Visual calendar of your coding activity
- **📈 Progress Charts** - Track improvement across difficulty levels
- **🎯 Daily Goals** - Personalized challenges to maintain momentum
- **🏆 Achievement System** - Unlock badges as you progress

### User Experience
- **Premium Dark Theme** - Modern design with vibrant gradients
- **Glassmorphism UI** - Sleek, translucent cards with backdrop blur
- **Smooth Animations** - Micro-interactions for enhanced engagement
- **Responsive Design** - Optimized for desktop and mobile
- **Split-Panel Workspace** - Problem description alongside code editor

## 🛠️ Tech Stack

### Frontend
- **React 19** - Latest UI library with hooks
- **Vite** - Lightning-fast build tool
- **Zustand** - Lightweight state management
- **Monaco Editor** - Premium code editing experience
- **Firebase Auth** - Secure Google authentication

### Backend
- **Node.js + Express** - Robust RESTful API
- **SQLite (Better-SQLite3)** - High-performance local database
- **Firebase Admin SDK** - Backend user synchronization

## 🚀 Deployment Guide

This project is configured for easy deployment using **Render** or **Vercel**.

### Backend (Render/Heroku/Railway)
1. Set the root directory to `server/`.
2. Set Environment Variables:
   - `FIREBASE_PROJECT_ID`: Your Firebase Project ID
   - `CLIENT_URL`: Your deployed frontend URL
   - `PORT`: 3001
3. Build Command: `npm install && npm run init-db && npm run seed`
4. Start Command: `npm start`

### Frontend (Vercel/Netlify)
1. Set the root directory to the project root.
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Set Environment Variables:
   - `VITE_API_URL`: Your deployed backend API URL (e.g., `https://api.dsasolver.com/api`)
   - `VITE_FIREBASE_*`: All your Firebase SDK keys

## 📁 Project Structure

```
dsasolver/
├── src/                # Frontend React application
├── server/             # Node.js Express Backend
├── public/             # Static assets
├── render.yaml         # Render Blueprint for easy deployment
└── README.md           # Documentation
```

## 📊 Status
- [x] Full-stack Authentication (Firebase + DB)
- [x] Code Execution Engine (Simulated)
- [x] Progress Syncing & Analytics
- [x] Persistence with SQLite

---

**Built with ❤️ for developers who want to master DSA**
