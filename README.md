# Admin Management System

## Overview
This project is an Admin Management System built with React for the frontend and Express.js for the backend. It allows for the creation, management, and authentication of admin users, as well as employee management functionalities.

## Features
- Admin authentication and authorization
- Admin profile management
- Employee management (CRUD operations)
- Former employee tracking
- Admin blocking/unblocking

## Tech Stack
- Frontend: React.js
- Backend: Express.js node js
- Database: Firebase Firestore
- Authentication: Firebase Auth

## Project Structure
The project is divided into frontend and backend components:

### Frontend
- `AdminManagement.js`: Manages the list of admins, including adding, removing, and blocking/unblocking admins.
- `AddAdmin.js`: Form component for adding new admins.
- `AdminProfile.js`: Displays and allows editing of an admin's profile.

### Backend
- `server.js`: Main Express.js server file.
- `adminController.js`: Contains admin-related route handlers.
- `employeeController.js`: Contains employee-related route handlers.
- `auth.js`: Middleware for authentication.

## Setup and Installation
1. Clone the repository
    ```
    https://github.com/ComfortN/employee-app.git
    ```
2. Install dependencies:
   ```
   cd client && npm install
   cd server && npm install
   ```
3. Set up Firebase:
   - Create a Firebase project
   - Add your Firebase configuration to the frontend
   - Set up Firebase Admin SDK for the backend
4. Start the backend server:
   ```
   cd server && npm start
   ```
5. Start the frontend development server:
   ```
   cd client && npm start
   ```

## API Endpoints
- `/api/admin/login`: Admin login
- `/api/admin/add`: Add new admin
- `/api/admin/all`: Get all admins
- `/api/admin/remove/:uid`: Remove an admin
- `/api/admin/profile`: Get/update admin profile
- `/api/admin/toggle-block/:uid`: Toggle admin block status
- `/api/employees`: CRUD operations for employees

## Security
- Uses Firebase Authentication for secure login
- Implements custom middleware for route protection
- Handles admin blocking to prevent access
