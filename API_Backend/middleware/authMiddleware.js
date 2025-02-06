const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const authMiddleware = (requiredRole = null) => (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1]; // Handle "Bearer <token>" format
  if (!token) {
    return res.status(401).json({ message: "Malformed token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded token payload:", decoded);

    req.user = decoded; // Attach the decoded user info to the request

    if (requiredRole && decoded.role !== requiredRole) {
      // console.log(`Access denied for role: ${decoded.role}, required: ${requiredRole}`);
      return res.status(403).json({ message: "Access denied: Insufficient permissions" });
    }

    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
