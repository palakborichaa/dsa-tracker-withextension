# DSA Tracker

A modern, full-stack web application for tracking Data Structures and Algorithms problems with a beautiful dark theme UI.

## Features

- **Modern Dark Theme UI**: Sleek, responsive design with dark colors and smooth animations
- **User Authentication**: Secure login and signup functionality
- **Problem Tracking**: Add, view, and manage your solved DSA problems
- **Problem Details**: Track problem name, platform, time complexity, and space complexity
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Instant feedback and loading states

## Tech Stack

### Frontend
- **React.js**: Modern UI framework
- **React Router**: Client-side routing
- **CSS3**: Custom styling with CSS variables and modern design patterns
- **Axios**: HTTP client for API calls

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing

## Project Structure

```
dsa-tracker/
├── frontend/                 # React frontend application
│   ├── public/              # Static files
│   ├── src/                 # Source code
│   │   ├── components/      # React components
│   │   ├── App.js          # Main app component
│   │   ├── App.css         # Main styles
│   │   └── index.js        # Entry point
│   └── package.json        # Frontend dependencies
├── backend/                 # Node.js backend application
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── server.js           # Server entry point
│   └── package.json        # Backend dependencies
└── README.md               # Project documentation
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd dsa-tracker
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**
   Create a `.env` file in the backend directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5050
   ```

5. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```

6. **Start the frontend development server**
   ```bash
   cd frontend
   npm start
   ```

7. **Open your browser**
   Navigate to `http://localhost:3000` to view the application

## Usage

1. **Sign Up**: Create a new account with your email and password
2. **Login**: Sign in with your credentials
3. **Add Problems**: Click "Add Problem" to track a new DSA problem
4. **View Progress**: See all your solved problems in a clean table format
5. **Manage Problems**: Edit or delete problems as needed

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Problems
- `GET /api/problems` - Get all problems for a user
- `POST /api/problems` - Add a new problem
- `PUT /api/problems/:id` - Update a problem
- `DELETE /api/problems/:id` - Delete a problem

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- React.js community for the amazing framework
- MongoDB for the flexible database solution
- Express.js for the robust backend framework
