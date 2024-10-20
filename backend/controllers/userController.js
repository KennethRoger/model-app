const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid user credentials" });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid user credentials" });
    }

    const payload = {
      user: {
        id: user._id,
        username: user.username,
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

    res.cookie("token", token, cookieOptions);

    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    console.error("login error", err);
    res.status(500).json({ message: "Server error" });
  }
};

const uploadProfileImage = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    await User.findByIdAndUpdate(userId, { profileImage: imageUrl });
    res
      .status(200)
      .json({ message: "Profile image uploaded successfully", imageUrl });
    console.log("success");
  } catch (err) {
    console.error("Image uploading error", err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUser = async (req, res) => {
  const { username, email, password } = req.body;
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "Invalid user" });
    }
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password doesn't match" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername && existingUsername._id.toString() !== userId) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail && existingEmail._id.toString() !== userId) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const response = await User.findByIdAndUpdate(
      userId,
      { username, email },
      { new: true }
    );

    if (!response) {
      return res
        .status(500)
        .json({ message: "Server error. User update failed" });
    }
    
    return res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Some error occured" });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const userToken = req.cookies.token; // Ensure the token exists
    if (!userToken) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(userToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.profileImage) {
      const imagePath = path.join(__dirname, "..", user.profileImage);
      
      if (!fs.existsSync(imagePath)) {
        user.profileImage = null;
      }
    } else {
      user.profileImage = null;
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("User data could not be fetched:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const logoutUser = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
    httpOnly: true,
    sameSite: "Lax",
  });
  res.status(200).json({ message: "Logout successful" });
};

module.exports = {
  registerUser,
  loginUser,
  getUserDetails,
  uploadProfileImage,
  logoutUser,
  updateUser,
};
