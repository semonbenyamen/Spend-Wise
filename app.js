require("dotenv").config();
const express = require("express");
const mongoose = require('mongoose');

const app = express();
//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connect database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB Connected Successfully");
  } catch (err) {
    console.error("DB Connection Failed", err);
    process.exit(1);
  }
};
connectDB();

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/expenses", require("./routes/expenseRoutes"));
app.use("/api/budget", require("./routes/budgetRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
