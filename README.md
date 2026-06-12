# Border Bridge – Volunteer Assistance & Case Management Platform

## Overview

Border Bridge is a full-stack volunteer coordination and humanitarian case-management platform designed to support displaced persons, refugees, and vulnerable populations. The system enables volunteers, border officers, medical personnel, shelter staff, legal teams, and managers to collaboratively register individuals, track cases, manage documentation, link family members, and coordinate assistance through a centralized digital platform.

The project consists of:

- Web Application (React + Vite)
- Mobile Application (React Native + Expo)
- Backend API Server (Node.js + Express + MongoDB)

---

## Key Features

### User Authentication & Role-Based Access Control

- Secure JWT-based authentication
- Password hashing using bcrypt
- Role-specific access permissions
- Volunteer and staff registration workflow

Supported Roles:

- Manager
- Border Officer
- Medical Staff
- Shelter Staff
- Legal Team

---

### Person Registration & Intake

- Register displaced individuals and beneficiaries
- Generate unique case IDs
- Store demographic information
- Track registration history
- QR code generation for quick identification

---

### Case Management

- Create and manage case files
- Add case notes and updates
- Track assistance progress
- Assign personnel to cases
- Maintain complete case history

---

### Family Reunification Support

- Link related individuals
- Track family relationships
- Manage reunification workflows
- Confirm relationship records

---

### Document Tracking

Supported document types include:

- Passport
- National ID
- UNHCR Certificate
- Asylum Application
- Referral Letter
- Medical Record
- Birth Certificate
- Other Supporting Documents

Document statuses:

- Submitted
- Pending
- Verified
- Missing

---

### AI-Assisted Triage

The platform integrates Google Generative AI to:

- Generate triage summaries
- Identify priority needs
- Recommend next steps
- Assist volunteers during intake

---

### Audit Logging

All important actions are recorded to ensure:

- Accountability
- Transparency
- Traceability
- Operational compliance

---

### Cross-Platform Access

Users can access the system through:

- Web Browser
- Android Application
- iOS Application

---

# System Architecture

```text
┌─────────────────┐
│   Web Client    │
└────────┬────────┘
         │
┌────────▼────────┐
│ Mobile Client   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│ Node.js + Express API   │
├─────────────────────────┤
│ Authentication Service  │
│ Case Management Service │
│ AI Triage Service       │
│ QR Generation Service   │
│ Document Service        │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│      MongoDB Atlas      │
└─────────────────────────┘
```

---

# Technology Stack

## Frontend

- React 19
- Vite
- React Router DOM
- Tailwind CSS
- Shadcn/UI
- Radix UI
- React Hook Form
- Zod Validation

## Mobile

- React Native
- Expo
- React Navigation
- Async Storage
- React Hook Form
- Zod

## Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcrypt
- Google Generative AI
- QR Code Generation
- Zod Validation

---

# Project Structure

```text
VOLUNTEER-APP-MADLAB/
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── server.js
│
├── frontend/
│   └── border-bridge/
│       ├── src/
│       ├── public/
│       └── package.json
│
├── mobile/
│   └── border-bridge-mobile/
│       ├── app/
│       ├── components/
│       └── package.json
│
└── README.md
```

---

# Installation

## Prerequisites

Install:

- Node.js (v18+ recommended)
- npm
- MongoDB Atlas account
- Google AI API Key

---

# Backend Setup

```bash
cd server

npm install
```

Create a `.env` file:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

JWT_EXPIRES_IN=7d

GOOGLE_API_KEY=your_google_api_key
```

Start the server:

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

---

# Frontend Setup

```bash
cd frontend/border-bridge

npm install

npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# Mobile Setup

```bash
cd mobile/border-bridge-mobile

npm install

npm start
```

Run using:

- Expo Go
- Android Emulator
- iOS Simulator

---

# API Modules

### Authentication

- Register User
- Login User
- JWT Verification

### Person Management

- Create Person
- Update Person
- View Person
- Search Person

### Case Management

- Create Case File
- Add Notes
- Assign Personnel

### Family Management

- Create Family Links
- Verify Relationships

### Document Management

- Upload Document Status
- Verify Documents
- Track Missing Documents

### AI Services

- Generate Triage Brief
- Priority Assessment
- Recommendations

---

# Security Features

- JWT Authentication
- Password Hashing (bcrypt)
- Role-Based Access Control (RBAC)
- Protected API Routes
- Audit Logging

---

# Future Enhancements

- Real-time notifications
- Volunteer scheduling
- Multi-language support
- Advanced analytics dashboard
- Offline mobile synchronization
- Emergency response workflows

---

# Academic Project Information

**Project Title:** Border Bridge – Volunteer Assistance & Case Management Platform

**Course:** Mobile Application Development Laboratory (MAD Lab)

**Purpose:** To provide a centralized platform for humanitarian organizations and volunteers to efficiently manage beneficiary registration, documentation, family reunification, and assistance workflows.

---

# License

This project is developed for educational and academic purposes.
