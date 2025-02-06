const express = require("express");
const dotenv = require("dotenv");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const authMiddleware = require("./middleware/authMiddleware");

dotenv.config();

const app = express();
app.use(express.json());

app.use("/admin",authMiddleware("admin"), adminRoutes);
app.use("/user",userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// Akash Parmar  akash24parmar@gmail.com