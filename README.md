# Border Bridge (VOLUNTEER-APP-MADLAB)

Border Bridge is a comprehensive application platform built to facilitate volunteer operations. The system is composed of three main components: a backend server, a web frontend, and a mobile application.

## Project Structure

This repository is organized into three primary directories:

- `/server` - The backend API server
- `/frontend/border-bridge` - The web application frontend
- `/mobile/border-bridge-mobile` - The mobile application

---

## 1. Backend Server (`/server`)

The backend is an Express-based Node.js server that uses MongoDB for data storage and integrates with Google's Generative AI.

**Key Technologies:**
- Node.js & Express
- MongoDB & Mongoose
- JSON Web Tokens (JWT) & bcrypt for authentication
- Google Generative AI
- Zod for validation

**Setup & Running:**
```bash
cd server
npm install
npm run dev
```

---

## 2. Web Frontend (`/frontend/border-bridge`)

The web frontend is built with React and Vite, utilizing modern styling and UI components.

**Key Technologies:**
- React (v19)
- Vite
- Tailwind CSS
- shadcn/ui & Radix UI
- React Router DOM
- React Hook Form & Zod

**Setup & Running:**
```bash
cd frontend/border-bridge
npm install
npm run dev
```

---

## 3. Mobile App (`/mobile/border-bridge-mobile`)

The mobile application is built using Expo and React Native, targeting iOS and Android platforms.

**Key Technologies:**
- React Native & Expo
- React Navigation
- React Hook Form & Zod
- Async Storage

**Setup & Running:**
```bash
cd mobile/border-bridge-mobile
npm install
npm start
```

---

## Getting Started

1. Clone the repository.
2. Ensure you have Node.js installed.
3. Set up the necessary environment variables in each project directory (e.g., `.env` for the server containing MongoDB URI, JWT secret, and Google AI API key).
4. Install dependencies for each of the three components as described above.
5. Start the backend server, followed by the web frontend or mobile app.
