// middleware/verifyToken.js
const jwt = require('jsonwebtoken');

// IMPORTANT: Use an environment variable for your JWT secret in production!
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_please_change_this_in_production';

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  console.log('Auth header:', authHeader); // Debug log
  
  const token = authHeader && authHeader.split(' ')[1]; // Expect "Bearer <token>"
  console.log('Extracted token:', token ? 'Token present' : 'No token'); // Debug log

  if (!token) {
    console.log('No token provided for request to:', req.path);
    return res.status(401).json({ error: 'No token provided, authorization denied' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT verification error:", err.message);
      console.error("Token that failed:", token.substring(0, 20) + '...');
      return res.status(403).json({ error: 'Token is not valid' });
    }
    // Ensure the payload from JWT sign is consistent: { userId: user._id }
    console.log('Token verified successfully for user:', decoded.userId);
    req.user = decoded; // decoded will contain { userId: '...' }
    next();
  });
}

module.exports = verifyToken;
