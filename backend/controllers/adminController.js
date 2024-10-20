const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcryptjs = require("bcryptjs")

const loginAdmin = async (req, res) => {
  const { name, adminID, password } = req.body;
  console.log(name, adminID, password);
  try {
    const admin = await Admin.findOne({ name, adminID, password });
    if (!admin) {
      return res.status(400).json({ message: "Invalid admin credentials" });
    }

    const payload = {
      admin: {
        id: admin._id,
        name: admin.name,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1hr",
    });

    const cookieOptions = {
      httpOnly: true,
      sameSite: "Lax",
      maxAge: 30 * 60 * 1000,
    };

    res.cookie("adminToken", token, cookieOptions);

    res
      .status(200)
      .json({ message: "Login successful", adminName: admin.name });
  } catch (err) {
    console.error("login error", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getEveryUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    if (!users) {
      return res.status(404).json({ message: "Users not found" });
    }
    res.status(200).json(users);
  } catch (err) {
    console.error("Obtaining users failed:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User doesn't exist" });
    }

    if (username) {
      const existingUsername = await User.findOne({ username });
      if (existingUsername && existingUsername._id.toString() !== id) {
        return res.status(400).json({ message: "Username already exists" });
      }
    }

    if (email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail && existingEmail._id.toString() !== id) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (password) {
      const hashedPassword = await bcryptjs.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(500).json({ message: "Server error. Client update failed" });
    }

    return res.status(200).json({ message: "Client updated successfully", user: updatedUser });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Some error occurred" });
  }
};


const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const logoutAdmin = async (req, res) => {
  res.cookie("adminToken", "", {
    expires: new Date(0),
    httpOnly: true,
    sameSite: "Lax",
  });
  res.status(200).json({ message: "Logout successful" });
};

module.exports = {
  loginAdmin,
  getEveryUsers,
  deleteUser,
  updateUser,
  logoutAdmin,
};
