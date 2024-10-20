const jwt = require("jsonwebtoken");

const authenticateAdminToken = (req, res, next) => {
  const token = req.cookies.adminToken;

  if (!token) {
    return res.status(401).json({
      authenticated: false,
      message: "Access denied. No token provided.",
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded.admin;
    next();
  } catch (err) {
    res.status(401).json({ authenticated: false, message: "Invalid token" });
  }
};

module.exports = authenticateAdminToken;
