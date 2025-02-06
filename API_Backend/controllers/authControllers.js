const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Logic for Register a new user
exports.register = async (req, res) => {
  const { name, email, password, role} = req.body; // Role input with default value
  try {
    console.log("Register request received for:", email);

    // Check if the user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      console.log("User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User(name, email, hashedPassword, role);
    const savedUser = await newUser.save();

    console.log("User registered successfully, ID:", savedUser.insertId);
    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error registering user:", err.message);
    res.status(500).json({ message: "Error registering user" });
  }
};

// Logic for Login of existing user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login request received for email:", email);

  try {
    // Check if the user exists
    const user = await User.findByEmail(email);
    if (!user) {
      console.log("User not found for email:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Verify the password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      console.log("Password mismatch for email:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate a JWT token with the user's role
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    console.log("Login successful, token generated:", token);
    res.json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    console.error("Error during login:", err.message);
    res.status(500).json({
      message: "Error logging in",
    });
  }
};
