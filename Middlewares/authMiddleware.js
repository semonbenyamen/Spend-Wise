const jwt = require("jsonwebtoken");
const User = require("../Models/User");

const protect = async (req, res, next) => {
    let token;

    // 1: التأكد من وجود الهيدر ويبدأ بـ Bearer
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];

            // التأكد إن token مش فاضي بعد الـ split
            if (!token) {
                return res.status(401).json({ msg: "No token found in header" });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
         //return هنا عشان نخرج من الفنكشن بعد الـ next
            return next();
        } catch (error) {
            console.log("Detailed JWT Error:", error.message);
            return res.status(401).json({ msg: "Token is not valid" });
        }
    }

    // 2: لو مفيش tokenأصلاً في الهيدرز
    if (!token) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }
};

module.exports = protect;