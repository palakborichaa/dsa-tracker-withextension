# Quick Start - Commands to Run

## 1. Install Dependencies (Run from root directory)
```bash
npm run install:all
```

## 2. Start MongoDB (if using local MongoDB)

**macOS with Homebrew:**
```bash
brew services start mongodb-community
```

**Or start mongod manually:**
```bash
mongod
```

## 3. Start the Project

**Option A: Run both frontend & backend together (RECOMMENDED)**
```bash
npm run dev
```
- Backend runs on: `http://localhost:5050`
- Frontend runs on: `http://localhost:3000`

**Option B: Run separately in different terminals**

Terminal 1 (Backend):
```bash
npm run backend:dev
```

Terminal 2 (Frontend):
```bash
npm run frontend:dev
```

## 4. Access the Application
Open your browser and go to: `http://localhost:3000`

## What Was Fixed

✅ Added missing `login()` and `signup()` functions to API module
✅ Fixed authentication API response handling
✅ Created `.env` files for both backend and frontend
✅ Updated frontend API URL to `http://localhost:5050`
✅ Fixed root `package.json` with proper npm scripts
✅ Added `concurrently` package for running both servers simultaneously

## Important Notes

- MongoDB must be running before starting the backend
- Make sure `.env` files exist in both `backend/` and `frontend/` folders
- Backend `.env` needs correct MongoDB connection string
- Frontend `.env` needs correct backend API URL (should be `http://localhost:5050`)

## If You See Errors

1. **"Cannot find module"**: Run `npm run install:all` again
2. **"Port already in use"**: Kill the process on that port or change PORT in `.env`
3. **"MongoDB connection failed"**: Check if MongoDB is running and connection string is correct
4. **"Signup/Login not working"**: Check browser console (F12) and backend terminal for errors

## Environment Variables

### backend/.env
```
MONGO_URI=mongodb://localhost:27017/dsatracker
JWT_SECRET=your_super_secret_jwt_key_please_change_this_in_production
PORT=5050
NODE_ENV=development
```

### frontend/.env
```
REACT_APP_API_URL=http://localhost:5050
```

That's it! Follow these steps and your DSA Tracker should work perfectly. 🚀
