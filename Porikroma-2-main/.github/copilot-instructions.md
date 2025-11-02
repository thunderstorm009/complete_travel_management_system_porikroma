# Porikroma Travel Platform - Copilot Instructions

This project is a comprehensive travel planning platform with:

## Backend (Spring Boot)

- **No JPA/Hibernate**: Uses JdbcTemplate for all database operations
- **Database**: MySQL with raw SQL queries
- **Authentication**: JWT with Spring Security
- **Real-time**: WebSocket for chat and notifications
- **File Upload**: ImgBB API integration
- **Email**: SMTP notifications

## Frontend (React)

- **Framework**: React 18 with TypeScript
- **Routing**: React Router DOM
- **State Management**: React Query for server state
- **UI**: Tailwind CSS + shadcn/ui components
- **Real-time**: Socket.io-client
- **Forms**: React Hook Form + Zod validation

## Key Features

- User registration/authentication with email verification
- Trip planning with collaborative features
- Real-time chat and notifications
- Expense tracking and splitting
- Review system
- Admin dashboard with analytics
- Search and filtering capabilities

## Project Structure

- `/backend` - Spring Boot application with JDBC
- `/frontend` - React application
- `/database` - MySQL schema and sample data

## Important Notes

- All database operations use raw SQL via JdbcTemplate
- No ORM entities - uses DTOs and RowMappers
- Real-time features via WebSocket
- Image uploads handled via ImgBB API
- Responsive design with mobile-first approach

<!-- Progress Tracking -->

- [x] Clarify Project Requirements - Travel platform with Spring Boot (JDBC) + React
- [ ] Scaffold the Project
- [ ] Customize the Project
- [ ] Install Required Extensions
- [ ] Compile the Project
- [ ] Create and Run Task
- [ ] Launch the Project
- [ ] Ensure Documentation is Complete
