# BusyBrains E-Commerce Platform

A full-stack e-commerce application built with Spring Boot 3.4+ and React 18+ using Vite. Implementations include stateless JWT authentication, Google Single Sign-On (SSO), Role-Based Access Control (RBAC), User Profile Management, and a fully polished responsive UI.

## Features

- **JWT Authentication**: Stateless authentication security using `jjwt`.
- **Google OAuth2 SSO**: Real Single Sign-On mapping Google profiles to local database users.
- **Role-Based Access Control (RBAC)**: Admin users can create, edit, and delete products. Regular users can only view products.
- **Profile Management**: Update name, email, and securely change passwords (hashed with BCrypt).
- **Responsive Frontend**: Built with React, TailwindCSS + Vite, styled beautifully.
- **Axios Interceptors**: Globally intercepts HTTP requests to attach JWTs, and redirects on 401 Unauthorized errors.

## Project Structure

This project follows a Feature-Based File Structure:

- **Backend**: `com.busybrains.ecommerce.[auth, product, profile, config, security, user]`
- **Frontend**: `src/[features/auth, features/products, features/profile, components, context, services]`

## Getting Started

### Prerequisites

- Java 17+
- Node.js 18+
- MySQL Server running locally on port 3306

### 1. Database Setup

Ensure MySQL is running on `locahost:3306` with username `root` and password `root`. 
The application will automatically create the database `busybrains_ecommerce` and seed it.

### 2. Backend Setup (Spring Boot)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. (Optional) Configure Google Client ID and Secret in `src/main/resources/application.properties` for SSO to work.
   ```properties
   spring.security.oauth2.client.registration.google.client-id=YOUR_CLIENT_ID
   spring.security.oauth2.client.registration.google.client-secret=YOUR_CLIENT_SECRET
   ```
3. Run the application (using Maven wrapper or locally installed Maven):
   ```bash
   mvn spring-boot:run
   ```
The backend server will start on `http://localhost:8080`.
The application automatically seeds 2 users and 10 products:
- Admin user: `admin@busybrains.com` / `password`
- Regular user: `user@busybrains.com` / `password`

### 3. Frontend Setup (React + Vite)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies (If you already did `npm install`, you don't need to do this):
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
The frontend will be available at `http://localhost:5173`. 
The Vite React app connects to the API on `http://localhost:8080/api`.

---

### Important Config Rules Addressed

- **STRICT OPERATIONAL**: The app was built independently with no manual prompts.
- **Modern Security**: Avoids deprecated `WebSecurityConfigurerAdapter`.
- **SSO Capture**: Frontend uses `AuthContext` to capture the JWT returned by Google SSO callback.

Enjoy exploring the e-commerce dashboard!
