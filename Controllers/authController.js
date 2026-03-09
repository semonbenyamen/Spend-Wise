const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 1: تسجيل مستخدم جديد
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ msg: "All fields required" });

    const existUser = await User.findOne({ email });
    if (existUser) return res.status(400).json({ msg: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

   res.status(201).json({
  msg: "User registered",
  user: {
    id: user._id,
    name: user.name,
    email: user.email
  }
});
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// 2: تسجيل الدخول للمستخدم
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid Credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

    // إنشاء الـ Token ( JWT )
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1d" }
    );

    res.status(200).json({ msg: "Login successful", token });
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
};



// عرض بيانات الملف الشخصي للمستخدم 
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        
        if (user) {
            res.json({
                success: true,
                _id: user._id,
                name: user.name,
                email: user.email
            });
        } else {
            res.status(404).json({ msg: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ msg: "Server Error" });
    }
};


module.exports = { registerUser, loginUser, getUserProfile };