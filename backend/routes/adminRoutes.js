const express = require("express");
const {
  loginAdmin,
  getEveryUsers,
  deleteUser,
  updateUser,
  logoutAdmin
} = require("../controllers/adminController");
const authenticateAdminToken = require("../middlewares/adminAuthMiddleware");

const router = express.Router();

// @route POST /api/admin/login
router.post("/login", loginAdmin);

// @route GET /api/admin/verify
router.get("/verify", authenticateAdminToken, (req, res) => {
  res
    .status(200)
    .json({ authenticated: true, message: "User is authenticated" });
});

// @route get /api/admin/userDetails
router.get("/userDetails", authenticateAdminToken, getEveryUsers);

// @route delete /api/admin/users/:id
router.delete("/users/:id", authenticateAdminToken, deleteUser);

// @route put /api/admin/users/:id
router.put("/users/:id", authenticateAdminToken, updateUser);

// @route post /api/admin/logout
router.post("/logout", authenticateAdminToken, logoutAdmin)

module.exports = router;
