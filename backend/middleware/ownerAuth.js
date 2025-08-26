// Simple owner authentication - just checks email and password
const ownerAuth = (req, res, next) => {
  const { email, password } = req.body;
  
  // Simple hardcoded check against environment variables
  if (email === process.env.OWNER_EMAIL && password === process.env.OWNER_PASSWORD) {
    req.isOwner = true;
    next();
  } else {
    res.status(401).json({ message: 'Invalid owner credentials' });
  }
};

// Middleware to verify owner session (for subsequent requests)
const verifyOwner = (req, res, next) => {
  const token = req.header('Owner-Token');
  
  // Simple token check - in production, use JWT for owner too
  if (token === 'owner-authenticated') {
    req.isOwner = true;
    next();
  } else {
    res.status(401).json({ message: 'Owner access required' });
  }
};

module.exports = { ownerAuth, verifyOwner };