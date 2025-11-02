# 🌍 Porikroma - Complete Travel Management System

[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-blue.svg)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

**Porikroma** is a comprehensive travel management platform built with modern web technologies. Plan trips, manage expenses, collaborate with travel companions, explore destinations, and keep everyone connected through real-time chat - all in one place.

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Database Overview](#-database-overview)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🔐 User Management & Authentication
- **User Registration & Login** - Secure authentication with JWT tokens
- **Email Verification** - OTP-based email verification system
- **Password Reset** - Forgot password with email recovery
- **Profile Management** - Update profile, upload profile pictures (ImgBB integration)
- **Role-based Access** - Traveller and Admin roles with different permissions
- **Soft Delete** - Admin can soft-delete users without permanent data loss

### 🗺️ Destination Exploration
- **Browse Destinations** - Explore travel destinations with detailed information
- **Sub-Destinations** - Discover attractions categorized by type (Historical, Natural, Cultural, Adventure, Religious, Entertainment, Shopping, Beach, Mountain)
- **Destination Details** - View weather, best visit times, safety ratings, budget levels
- **Accommodations** - Browse hotels, resorts, guesthouses with pricing and amenities
- **Transportation** - Find buses, trains, flights, car rentals with schedules and prices
- **Reviews & Ratings** - Read and write reviews for destinations, accommodations, and transport
- **Interactive Maps** - Latitude/longitude coordinates for location mapping

### 🎒 Trip Planning & Management
- **Create Trips** - Plan trips with custom names, budgets, and dates
- **Trip Status Tracking** - Track trips through stages: Planning, Confirmed, Ongoing, Completed, Cancelled
- **Collaborative Planning** - Invite friends and family to join trips
- **Member Roles** - Trip Creator, Admin, and Member roles with different permissions
- **Invitation System** - Send and manage trip invitations with accept/decline functionality
- **Trip Timeline** - Manage start and end dates with visual timeline
- **Custom Trip Photos** - Upload custom trip cover photos

### 💬 Real-time Trip Chat
- **Group Chat** - Real-time messaging for trip members using WebSocket
- **Multiple Message Types** - Text, images, files, location sharing, system messages, polls
- **Message Features** - Reply to messages, edit messages, message history
- **Poll Creation** - Create polls for group decisions
- **File Sharing** - Share images and files within chat (ImgBB integration)
- **Live Updates** - Instant message delivery with Socket.IO and STOMP

### 💰 Expense Management & Splitting
- **Track Expenses** - Record trip expenses with categories (Accommodation, Transport, Food, Activities, Shopping, Emergency, Other)
- **Smart Splitting** - Multiple split methods: Equal, Percentage, Amount, Custom
- **Receipt Upload** - Attach receipt images to expenses
- **Expense Settlements** - Track who owes whom with automatic calculations
- **Payment Tracking** - Mark settlements as paid with checkboxes
- **Expense Categories** - Organize expenses by type for better reporting
- **Multi-Currency Support** - Record expenses in different currencies (default: BDT)

### 🔔 Notifications System
- **Real-time Notifications** - Instant notifications for trip activities
- **Notification Types** - Trip invitations, trip updates, payment reminders, general alerts
- **Priority Levels** - Low, Medium, High, Urgent priority classification
- **Notification Center** - Centralized view of all notifications
- **Mark as Read** - Track read/unread notifications
- **Action Links** - Direct links to relevant content from notifications

### 👨‍💼 Admin Dashboard
- **User Management** - View, edit, and manage all users
- **Destination Management** - CRUD operations for destinations and sub-destinations
- **Accommodation Management** - Manage accommodation listings
- **Transport Management** - Manage transportation options
- **Analytics** - View platform statistics and user activity
- **Soft Delete Users** - Admin capability to soft-delete problematic users

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.2.0
- **Language**: Java 21
- **Security**: Spring Security with JWT authentication
- **Database**: MySQL 8.0+ with JDBC
- **Real-time**: WebSocket with STOMP protocol
- **Email**: Spring Mail for notifications and verification
- **Build Tool**: Maven
- **Additional Libraries**:
  - `io.jsonwebtoken` - JWT token generation and validation
  - `socket.io` - Real-time bidirectional communication
  - `lombok` - Reduce boilerplate code
  - `validation-api` - Request validation

### Frontend
- **Framework**: React 19.2.0
- **Language**: TypeScript 4.9.5
- **State Management**: TanStack Query (React Query) 5.90.2
- **Routing**: React Router DOM 7.9.3
- **Styling**: Tailwind CSS 3.4.18
- **UI Components**:
  - Headless UI 2.2.9
  - Radix UI (Avatar, Dialog, Progress, Separator, Tabs)
  - Heroicons 2.2.0
  - Lucide React 0.544.0
- **Forms**: React Hook Form 7.63.0 with Zod validation
- **Real-time**: Socket.IO Client 4.7.5, STOMP.js 7.2.0
- **HTTP Client**: Axios 1.12.2
- **Notifications**: React Hot Toast 2.6.0, Sonner 2.0.7
- **Animations**: Framer Motion 12.23.22
- **Phone Input**: React Phone Input 2.15.1

### Database
- **RDBMS**: MySQL 8.0+
- **Character Set**: UTF8MB4 (full Unicode support including emojis)
- **Collation**: utf8mb4_unicode_ci

### Additional Services
- **Image Hosting**: ImgBB (for user uploads)
- **Image Placeholder**: Unsplash (for default images)

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Client Browser                      │
│              (React + TypeScript SPA)                   │
└─────────────────┬───────────────────────────────────────┘
                  │
                  │ HTTP/HTTPS REST API
                  │ WebSocket (STOMP)
                  │
┌─────────────────▼───────────────────────────────────────┐
│                  Spring Boot Backend                    │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Controllers (REST APIs)                          │   │
│  │ - Auth, User, Trip, Destination, Expense, Chat  │   │
│  └──────────────┬───────────────────────────────────┘   │
│                 │                                        │
│  ┌──────────────▼───────────────────────────────────┐   │
│  │ Security Layer (JWT + Spring Security)          │   │
│  └──────────────┬───────────────────────────────────┘   │
│                 │                                        │
│  ┌──────────────▼───────────────────────────────────┐   │
│  │ Services (Business Logic)                        │   │
│  └──────────────┬───────────────────────────────────┘   │
│                 │                                        │
│  ┌──────────────▼───────────────────────────────────┐   │
│  │ Repositories (JDBC Template)                     │   │
│  └──────────────┬───────────────────────────────────┘   │
└─────────────────┼───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│                  MySQL Database                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │ 17 Tables: users, trips, destinations,          │   │
│  │ expenses, messages, notifications, etc.         │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Overview

The system uses **17 interconnected tables** to manage all aspects of travel planning:

### Core Tables

#### 1. **users** - User Management
Stores user accounts with authentication and profile information.
- **Key Fields**: `user_id`, `username`, `email`, `password` (hashed), `role` (TRAVELLER/ADMIN)
- **Features**: Email/phone verification, soft delete, emergency contacts, travel preferences
- **Roles**: TRAVELLER, ADMIN

#### 2. **user_tokens** - Authentication Tokens
Manages OTP tokens for email verification, password reset, and remember-me functionality.
- **Types**: EMAIL_VERIFICATION, PASSWORD_RESET, REMEMBER_ME
- **Security**: Token expiration, one-time use tracking

#### 3. **destinations** - Travel Destinations
Main destinations with comprehensive travel information.
- **Key Fields**: `destination_name`, `country`, `city`, `latitude`, `longitude`
- **Features**: Weather info, best visit times, safety ratings, budget levels
- **Safety Ratings**: VERY_SAFE, SAFE, MODERATE, CAUTION, AVOID
- **Budget Levels**: BUDGET, MID_RANGE, LUXURY, PREMIUM

#### 4. **sub_destinations** - Points of Interest
Attractions and places to visit within destinations.
- **Categories**: HISTORICAL, NATURAL, CULTURAL, ADVENTURE, RELIGIOUS, ENTERTAINMENT, SHOPPING, BEACH, MOUNTAIN
- **Details**: Entry fees, opening hours, duration, difficulty levels
- **Accessibility**: Facility information, best visit times

#### 5. **accommodations** - Lodging Options
Hotels, resorts, guesthouses, and other accommodations.
- **Types**: HOTEL, RESORT, GUESTHOUSE, HOSTEL, APARTMENT, VILLA, COTTAGE
- **Details**: Pricing, amenities, room types, check-in/out times, cancellation policies
- **Media**: Multiple photos (JSON array of URLs)

#### 6. **transport** - Transportation Options
Available transportation between and within destinations.
- **Types**: BUS, TRAIN, FLIGHT, CAR_RENTAL, BOAT, MOTORCYCLE
- **Details**: Routes, schedules, pricing, seat types, booking info
- **Features**: Seasonal availability, frequency information

### Trip Management Tables

#### 7. **trips** - Trip Planning
User-created trips with destination and timeline information.
- **Status Flow**: PLANNING → CONFIRMED → ONGOING → COMPLETED (or CANCELLED)
- **Features**: Custom names, budgets, photos, date ranges
- **Ownership**: Creator user tracking

#### 8. **trip_members** - Trip Participants
Manages who is part of each trip with roles and permissions.
- **Roles**: CREATOR, ADMIN, MEMBER
- **Invitation Status**: PENDING, ACCEPTED, DECLINED, REMOVED
- **Features**: Budget contributions, dietary preferences, special requirements

#### 9. **trip_subdestinations** - Trip Itinerary
Links trips to specific sub-destinations with planning details.
- **Status**: PLANNED, CONFIRMED, COMPLETED, SKIPPED
- **Features**: Cost estimates, custom notes

#### 10. **trip_accommodations** - Accommodation Bookings
Manages accommodation reservations for trips.
- **Booking Status**: PLANNED, BOOKED, CONFIRMED, CANCELLED
- **Details**: Check-in/out dates, room types, costs, booking references

#### 11. **trip_transport** - Transport Bookings
Manages transportation bookings for trips.
- **Journey Types**: TO_DESTINATION, FROM_DESTINATION, LOCAL_TRANSPORT
- **Details**: Travel dates, times, passenger counts, seat preferences

#### 12. **trip_invitations** - Trip Invites
Manages invitations sent to users to join trips.
- **Status**: PENDING, ACCEPTED, DECLINED, EXPIRED
- **Features**: Custom messages, expiration dates

### Communication Tables

#### 13. **trip_messages** - Group Chat
Real-time messaging system for trip members.
- **Message Types**: TEXT, IMAGE, FILE, LOCATION, SYSTEM, POLL
- **Features**: Replies, editing, polls with voting (JSON), file attachments
- **Threading**: Reply-to functionality for conversations

#### 14. **user_notifications** - Notification System
Platform-wide notifications for users.
- **Types**: TRIP_INVITATION, TRIP_UPDATE, PAYMENT_REMINDER, GENERAL
- **Priority**: LOW, MEDIUM, HIGH, URGENT
- **Features**: Read/unread tracking, action URLs, entity references

### Financial Tables

#### 15. **trip_expenses** - Expense Tracking
Records all expenses for trips.
- **Categories**: ACCOMMODATION, TRANSPORT, FOOD, ACTIVITIES, SHOPPING, EMERGENCY, OTHER
- **Split Methods**: EQUAL, PERCENTAGE, AMOUNT, CUSTOM
- **Features**: Receipt uploads, multi-currency, shared/individual expenses

#### 16. **expense_settlements** - Expense Splits
Tracks how expenses are split among trip members.
- **Features**: Amount owed vs. paid tracking, checkbox confirmation, notes
- **Settlement**: Automatic calculation of who owes whom

### Review System

#### 17. **reviews** - User Reviews
User reviews and ratings for destinations, accommodations, and transport.
- **Entity Types**: DESTINATION, SUB_DESTINATION, ACCOMMODATION, TRANSPORT
- **Features**: 1-5 star ratings, photos, helpful votes
- **Privacy**: Public/private toggle

### Database Indexing
Optimized with **18 indexes** on frequently queried columns:
- User lookups (email, username)
- Trip searches (creator, destination, dates, status)
- Notifications (user, read status, timestamps)
- Messages (trip, timestamps)
- Reviews (user, entity type)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Java Development Kit (JDK)** 21 or higher
- **Maven** 3.6+ (for building the backend)
- **Node.js** 16+ and npm (for the frontend)
- **MySQL** 8.0+ (for the database)
- **Git** (for cloning the repository)

### Installation Steps

#### 1. Clone the Repository

```bash
git clone https://github.com/thunderstorm009/complete_travel_management_system_porikroma.git
cd complete_travel_management_system_porikroma
```

#### 2. Database Setup

```bash
# Login to MySQL
mysql -u root -p

# Create database and import schema
mysql -u root -p < Porikroma-2-main/database/schema.sql
```

Or manually:
```sql
CREATE DATABASE porikroma CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE porikroma;
SOURCE /path/to/database/schema.sql;
```

#### 3. Backend Setup

```bash
cd Porikroma-2-main/backend

# Configure database connection
# Edit src/main/resources/application.properties
```

Update `application.properties` with your database credentials:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/porikroma?useSSL=false&serverTimezone=UTC
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password

# JWT Secret (change this!)
jwt.secret=your-secret-key-here-minimum-256-bits

# Email configuration (for verification and password reset)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

Build and run the backend:
```bash
# Using Maven
mvn clean install
mvn spring-boot:run

# Or build JAR and run
mvn package
java -jar target/porikroma-backend-0.0.1-SNAPSHOT.jar
```

Backend will start on **http://localhost:8080**

#### 4. Frontend Setup

```bash
cd Porikroma-2-main/frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend will start on **http://localhost:3000**

#### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **API Health Check**: http://localhost:8080/actuator/health (if actuator is enabled)

### Default Admin Account

After importing the database, you may need to create an admin account manually or through registration and then update the role in the database:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@porikroma.com';
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:8080
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| POST | `/auth/verify-email` | Verify email with OTP | No |
| POST | `/auth/forgot-password` | Request password reset | No |
| POST | `/auth/reset-password` | Reset password with token | No |
| POST | `/auth/refresh-token` | Refresh JWT token | Yes |

### User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users/profile` | Get current user profile | Yes |
| PUT | `/users/profile` | Update user profile | Yes |
| POST | `/users/profile/photo` | Upload profile picture | Yes |
| GET | `/users/{id}` | Get user by ID | Yes |
| DELETE | `/users/{id}` | Soft delete user (Admin) | Yes (Admin) |

### Destination Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/destinations` | List all destinations | No |
| GET | `/destinations/{id}` | Get destination details | No |
| POST | `/destinations` | Create destination (Admin) | Yes (Admin) |
| PUT | `/destinations/{id}` | Update destination (Admin) | Yes (Admin) |
| DELETE | `/destinations/{id}` | Delete destination (Admin) | Yes (Admin) |
| GET | `/destinations/{id}/sub-destinations` | List sub-destinations | No |
| GET | `/destinations/{id}/accommodations` | List accommodations | No |
| GET | `/destinations/{id}/transport` | List transport options | No |

### Trip Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/trips` | List user's trips | Yes |
| POST | `/trips` | Create new trip | Yes |
| GET | `/trips/{id}` | Get trip details | Yes |
| PUT | `/trips/{id}` | Update trip | Yes |
| DELETE | `/trips/{id}` | Delete trip | Yes |
| POST | `/trips/{id}/invite` | Invite user to trip | Yes |
| POST | `/trips/{id}/members` | Add trip member | Yes |
| PUT | `/trips/{id}/members/{memberId}` | Update member role | Yes |
| DELETE | `/trips/{id}/members/{memberId}` | Remove member | Yes |

### Chat Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/trips/{tripId}/messages` | Get trip messages | Yes |
| POST | `/trips/{tripId}/messages` | Send message | Yes |
| PUT | `/messages/{id}` | Edit message | Yes |
| DELETE | `/messages/{id}` | Delete message | Yes |
| WebSocket | `/ws` | WebSocket connection for real-time chat | Yes |

### Expense Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/trips/{tripId}/expenses` | List trip expenses | Yes |
| POST | `/trips/{tripId}/expenses` | Add expense | Yes |
| PUT | `/expenses/{id}` | Update expense | Yes |
| DELETE | `/expenses/{id}` | Delete expense | Yes |
| GET | `/expenses/{id}/settlements` | Get expense settlements | Yes |
| PUT | `/settlements/{id}` | Update settlement status | Yes |

### Notification Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/notifications` | List user notifications | Yes |
| PUT | `/notifications/{id}/read` | Mark as read | Yes |
| DELETE | `/notifications/{id}` | Delete notification | Yes |
| PUT | `/notifications/read-all` | Mark all as read | Yes |

### Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Response Format

**Success Response:**
```json
{
  "status": "success",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "status": "error",
  "message": "Error description",
  "timestamp": "2025-11-02T10:30:00Z"
}
```

---

## 📁 Project Structure

```
complete_travel_management_system_porikroma/
├── Porikroma-2-main/
│   ├── backend/                          # Spring Boot Backend
│   │   ├── src/
│   │   │   ├── main/
│   │   │   │   ├── java/com/porikroma/
│   │   │   │   │   ├── config/          # Security, WebSocket config
│   │   │   │   │   ├── controller/      # REST Controllers
│   │   │   │   │   │   ├── AuthController.java
│   │   │   │   │   │   ├── UserController.java
│   │   │   │   │   │   ├── TripController.java
│   │   │   │   │   │   ├── DestinationController.java
│   │   │   │   │   │   ├── ExpenseController.java
│   │   │   │   │   │   ├── ChatController.java
│   │   │   │   │   │   ├── NotificationController.java
│   │   │   │   │   │   └── AdminController.java
│   │   │   │   │   ├── dto/             # Data Transfer Objects
│   │   │   │   │   ├── exception/       # Custom exceptions & handlers
│   │   │   │   │   ├── repository/      # JDBC Repositories
│   │   │   │   │   ├── security/        # JWT & Security filters
│   │   │   │   │   ├── service/         # Business logic
│   │   │   │   │   ├── util/            # Utility classes & row mappers
│   │   │   │   │   └── PorikromaApplication.java
│   │   │   │   └── resources/
│   │   │   │       └── application.properties
│   │   │   └── test/                    # Unit tests
│   │   ├── target/                      # Compiled classes
│   │   └── pom.xml                      # Maven dependencies
│   │
│   ├── frontend/                         # React Frontend
│   │   ├── public/
│   │   │   ├── index.html
│   │   │   ├── manifest.json
│   │   │   └── robots.txt
│   │   ├── src/
│   │   │   ├── api/                     # API client functions
│   │   │   │   ├── auth.ts
│   │   │   │   ├── user.ts
│   │   │   │   ├── trip.ts
│   │   │   │   ├── destination.ts
│   │   │   │   ├── expense.ts
│   │   │   │   ├── chat.ts
│   │   │   │   ├── notification.ts
│   │   │   │   ├── admin.ts
│   │   │   │   └── client.ts            # Axios instance
│   │   │   ├── components/              # Reusable components
│   │   │   │   ├── Layout.tsx
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── ProtectedRoute.tsx
│   │   │   │   ├── LoadingSpinner.tsx
│   │   │   │   └── ImageUploader.tsx
│   │   │   ├── context/                 # React Context
│   │   │   │   └── AuthContext.tsx
│   │   │   ├── pages/                   # Page components
│   │   │   │   ├── HomePage.tsx
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   ├── RegisterPage.tsx
│   │   │   │   ├── DashboardPage.tsx
│   │   │   │   ├── DestinationsPage.tsx
│   │   │   │   ├── DestinationDetailPage.tsx
│   │   │   │   ├── TripNewPage.tsx
│   │   │   │   ├── TripDetailPage.tsx
│   │   │   │   ├── TripChatPage.tsx
│   │   │   │   ├── ExpensesPage.tsx
│   │   │   │   ├── NotificationsPage.tsx
│   │   │   │   ├── ProfilePage.tsx
│   │   │   │   ├── AdminDashboardPage.tsx
│   │   │   │   ├── ForgotPasswordPage.tsx
│   │   │   │   ├── ResetPasswordPage.tsx
│   │   │   │   ├── VerifyEmailPage.tsx
│   │   │   │   └── TripInvitationResponsePage.tsx
│   │   │   ├── types/                   # TypeScript types
│   │   │   │   └── index.ts
│   │   │   ├── utils/                   # Utility functions
│   │   │   │   ├── validation.ts
│   │   │   │   ├── helpers.ts
│   │   │   │   └── imageUpload.ts
│   │   │   ├── App.tsx                  # Main App component
│   │   │   ├── index.tsx                # Entry point
│   │   │   └── index.css                # Global styles
│   │   ├── package.json                 # npm dependencies
│   │   ├── tsconfig.json                # TypeScript config
│   │   └── tailwind.config.js           # Tailwind CSS config
│   │
│   ├── database/                         # Database files
│   │   ├── schema.sql                   # Complete DB schema
│   │   └── schema_yes2.sql              # Alternative schema
│   │
│   ├── docs/                             # Documentation
│   │   ├── FRONTEND.md                  # Frontend documentation
│   │   └── BACKEND.md                   # Backend documentation
│   │
│   ├── run.sh                            # Start both servers (Linux/Mac)
│   ├── stop.sh                           # Stop servers
│   ├── cleanup.sh                        # Cleanup processes
│   ├── SCRIPTS_README.md                # Scripts documentation
│   └── UI_ENHANCEMENT_SUMMARY.md        # UI enhancements log
│
├── README.md                             # This file
└── .git/                                 # Git repository
```

---

## 🔧 Environment Variables

### Backend (`application.properties`)

```properties
# Server Configuration
server.port=8080

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/porikroma?useSSL=false&serverTimezone=UTC
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD:password}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JWT Configuration
jwt.secret=${JWT_SECRET:your-256-bit-secret-key-change-this-in-production}
jwt.expiration=86400000

# Email Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=${MAIL_USERNAME:your-email@gmail.com}
spring.mail.password=${MAIL_PASSWORD:your-app-password}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# File Upload
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# Logging
logging.level.com.porikroma=DEBUG
logging.level.org.springframework.security=DEBUG
```

### Frontend (`.env`)

```env
# API Base URL
REACT_APP_API_BASE_URL=http://localhost:8080

# WebSocket URL
REACT_APP_WS_URL=http://localhost:8080/ws

# ImgBB API Key (for image uploads)
REACT_APP_IMGBB_API_KEY=your-imgbb-api-key

# Environment
REACT_APP_ENV=development
```

---

## 📸 Screenshots

> **Note**: Add screenshots of your application here

### Homepage
![Homepage](./screenshots/homepage.png)

### Trip Dashboard
![Trip Dashboard](./screenshots/dashboard.png)

### Destination Explorer
![Destinations](./screenshots/destinations.png)

### Trip Chat
![Chat](./screenshots/chat.png)

### Expense Manager
![Expenses](./screenshots/expenses.png)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Coding Standards
- Follow Java naming conventions for backend code
- Use TypeScript strict mode for frontend
- Write unit tests for new features
- Update documentation for API changes

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Faizul**
- GitHub: [@thunderstorm009](https://github.com/thunderstorm009)
- Email: abrar.lol789@gmail.com

---

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- React team for the amazing UI library
- Tailwind CSS for the utility-first CSS framework
- ImgBB for image hosting
- MySQL team for the robust database

---

## 📞 Support

For support, email abrar.lol789@gmail.com or open an issue in the GitHub repository.

---

**Happy Traveling with Porikroma! 🌍✈️**
