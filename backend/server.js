const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");

const port = 3000;
dotenv.config();

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/users", userRoutes);

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server started running on port ${port}`);
  });
});
