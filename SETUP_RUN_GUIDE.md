# DSA Tracker - Setup & Run Guide

## Prerequisites

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (local or cloud)
  - Local: Install from [mongodb.com](https://www.mongodb.com/try/download/community)
  - Cloud: MongoDB Atlas (free tier available)
- **npm** or **yarn** (comes with Node.js)

## Setup Instructions

### 1. Install All Dependencies

From the root directory, run:
```bash
npm run install:all
```

This will install dependencies for:
- Root project
- Backend server
- Frontend React app

### 2. Configure Environment Variables

#### Backend Configuration (backend/.env)
Already created, but verify/update if needed:
```env
MONGO_URI=mongodb://localhost:27017/dsatracker
JWT_SECRET=your_super_secret_jwt_key_please_change_this_in_production
PORT=5050
NODE_ENV=development
```

**For MongoDB Atlas (Cloud):**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dsatracker?retryWrites=true&w=majority
```

#### Frontend Configuration (frontend/.env)
Already created:
```env
REACT_APP_API_URL=http://localhost:5050
```

### 3. Ensure MongoDB is Running

**Local MongoDB:**
```bash
# macOS (if installed via Homebrew)
brew services start mongodb-community

# Or manually start mongod
mongod
```

**MongoDB Atlas:**
- No local setup needed, just use the connection string in backend/.env

## Running the Project

### Option 1: Run Both Backend & Frontend Together (Recommended)

```bash
npm run dev
```

This command:
- Starts backend server on `http://localhost:5050`
- Starts frontend app on `http://localhost:3000`
- Uses `concurrently` to run both simultaneously

### Option 2: Run Backend & Frontend Separately

**Terminal 1 - Backend:**
```bash
npm run backend:dev
```
Server starts on `http://localhost:5050`

**Terminal 2 - Frontend:**
```bash
npm run frontend:dev
```
Frontend starts on `http://localhost:3000`

### Option 3: Production Build

```bash
npm run build
```

This creates:
- Backend ready for deployment
- Frontend optimized build in `frontend/build/`

## Verify Everything Works

1. **Backend Health Check:**
   ```bash
   curl http://localhost:5050/health
   ```
   Should return: `{ "status": "OK", "timestamp": "...", "uptime": ... }`

2. **Frontend Access:**
   - Open `http://localhost:3000` in your browser
   - Click "Get Started" or "Sign In"

3. **Test Signup:**
   - Create a test account with email and password
   - Check for success message

4. **Test Login:**
   - Login with your test credentials
   - Should redirect to profile page

## Project Structure

```
dsa-tracker/
├── backend/
│   ├── models/              (MongoDB schemas)
│   ├── routes/              (API endpoints)
│   ├── middleware/          (Auth middleware)
│   ├── server.js            (Main backend entry)
│   ├── .env                 (Backend config)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      (React components)
│   │   ├── api.js           (API calls)
│   │   └── App.js           (Main app)
│   ├── .env                 (Frontend config)
│   └── package.json
├── package.json             (Root config with npm scripts)
└── FIXES_APPLIED.md        (Detailed fixes document)
```

## Available npm Scripts

From root directory:

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start both backend & frontend in dev mode |
| `npm run start` | Start both backend & frontend (production) |
| `npm run backend` | Start only backend |
| `npm run frontend` | Start only frontend |
| `npm run backend:dev` | Start backend with nodemon auto-reload |
| `npm run frontend:dev` | Start frontend with hot reload |
| `npm run install:all` | Install all dependencies |
| `npm run build` | Build for production |

## Troubleshooting

### Port Already in Use

If port 5050 or 3000 is already in use:

**For Backend (change port):**
```bash
# Edit backend/.env
PORT=5051  # Or any free port
```

**For Frontend:**
```bash
# Automatic: Will use next available port
# Or set it manually
PORT=3001 npm run frontend:dev
```

### MongoDB Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
1. Ensure MongoDB is running
2. Check connection string in `backend/.env`
3. If using MongoDB Atlas, ensure IP is whitelisted

### Signup/Login Not Working

1. Check browser console for errors (F12)
2. Check backend logs in terminal
3. Verify `backend/.env` has correct values
4. Verify `frontend/.env` API URL matches backend URL

### CORS Errors

If you see CORS errors:
1. Check `backend/server.js` CORS configuration
2. Ensure frontend URL is in allowed origins
3. For local dev, it should allow `http://localhost:3000`

## Deployment Notes

### For Production Deployment:

1. **Update JWT Secret:**
   ```env
   JWT_SECRET=<generate-a-strong-random-string>
   ```

2. **Update Frontend API URL:**
   ```env
   REACT_APP_API_URL=https://your-deployed-backend.com
   ```

3. **Update MongoDB URI** to production database

4. **Update CORS in backend/server.js** with production URLs

## Support

For issues or questions, check:
- Backend logs in terminal
- Browser console (F12)
- MongoDB connection status
- Environment variables configuration
