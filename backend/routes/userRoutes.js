const express = require("express");
const {
  registerUser,
  loginUser,
  getUserDetails,
  logoutUser,
  uploadProfileImage,
  updateUser,
} = require("../controllers/userController");
const authenticateToken = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

// @route   POST /api/users/register
router.post("/register", registerUser);

// @route POST /api/users/login
router.post("/login", loginUser);

// @route GET /api/users/verify
router.get("/verify", authenticateToken, (req, res) => {
  res
    .status(200)
    .json({ authenticated: true, message: "User is authenticated" });
});

// @route POST /api/users/upload
router.post(
  "/upload",
  authenticateToken,
  upload.single("profileImage"),
  uploadProfileImage
);

// @route GET /api/users/me
router.get("/me", authenticateToken, getUserDetails);

// @route PUT /api/users/me
router.put("/me", authenticateToken, updateUser);

// @route GET /api/users/logout
router.post("/logout", logoutUser);

module.exports = router;
