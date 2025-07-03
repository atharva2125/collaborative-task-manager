# Collaborative Task Manager

A full-stack MERN (MongoDB, Express.js, React, Node.js) application for collaborative task management with role-based access control (RBAC).

## Features

- **User Authentication**: JWT-based authentication with secure login/register
- **Role-Based Access Control**: Three user roles with different permissions
  - **Admin**: Full access to all features including user management
  - **Manager**: Can create, edit, and delete tasks; manage team tasks
  - **Member**: Can view and update assigned tasks
- **Task Management**: Create, assign, update, and delete tasks
- **User Management**: Admin can manage user accounts and roles
- **Responsive UI**: Modern Material-UI components with responsive design

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend
- **React** - Frontend library
- **React Router DOM** - Client-side routing
- **Material-UI (@mui)** - UI components and styling
- **Axios** - HTTP client for API requests
- **Context API** - State management for authentication

## Project Structure

```
collaborative-task-manager/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── rbac.js
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── tasks.js
│   │   └── users.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   └── ProtectedRoute.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── TaskList.js
│   │   │   ├── CreateTask.js
│   │   │   └── UserManagement.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd collaborative-task-manager
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
# Create a .env file in the backend directory with the following variables:
```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/collaborative-task-manager
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
```

**Note**: Replace `MONGODB_URI` with your MongoDB connection string if using MongoDB Atlas.

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install
```

## Running the Application

### 1. Start MongoDB

Make sure MongoDB is running on your system:

- **Local MongoDB**: Start the MongoDB service
- **MongoDB Atlas**: Ensure your cluster is running and accessible

### 2. Start the Backend Server

```bash
# From the backend directory
cd backend
npm start
```

The backend server will start on `http://localhost:5000`

### 3. Start the Frontend Development Server

```bash
# From the frontend directory (open a new terminal)
cd frontend
npm start
```

The frontend application will start on `http://localhost:3000` and automatically open in your browser.

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Task Routes
- `GET /api/tasks` - Get all tasks (filtered by role)
- `POST /api/tasks` - Create new task (Manager/Admin only)
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task (Manager/Admin only)

### User Routes
- `GET /api/users` - Get all users (Admin only)
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

## Default User Roles

The application supports three user roles:

1. **Admin**: Complete access to all features
2. **Manager**: Can manage tasks and view team members
3. **Member**: Can view and update assigned tasks only

## Usage Guide

### Getting Started

1. **Register**: Create a new account (default role: Member)
2. **Login**: Use your credentials to access the application
3. **Dashboard**: View your role-specific dashboard
4. **Tasks**: View, create, and manage tasks based on your role
5. **User Management**: Admin users can manage other users

### Role-Based Features

#### Admin Users Can:
- View and manage all tasks
- Create, edit, and delete tasks
- Manage user accounts and roles
- Access user management dashboard

#### Manager Users Can:
- View and manage tasks
- Create and assign tasks to team members
- Edit and delete tasks
- View team member information

#### Member Users Can:
- View tasks assigned to them
- Update task status and progress
- View basic dashboard information

## Development

### Available Scripts

#### Backend
- `npm start` - Start the production server
- `npm run dev` - Start development server with nodemon

#### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Environment Variables

Backend `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/collaborative-task-manager
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check your connection string in `.env`
   - For MongoDB Atlas, ensure your IP is whitelisted

2. **Port Already in Use**
   - Backend: Change PORT in `.env` file
   - Frontend: Set PORT environment variable or use different port

3. **JWT Authentication Issues**
   - Ensure JWT_SECRET is set in backend `.env`
   - Check if token is being sent in request headers

4. **CORS Errors**
   - Verify backend CORS configuration
   - Ensure frontend is making requests to correct backend URL

### Development Tips

- Use browser developer tools to inspect network requests
- Check backend console for error messages
- Verify user roles and permissions in database
- Test with different user roles to ensure RBAC works correctly

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
