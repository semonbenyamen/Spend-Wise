const isAdmin = (req, res, next) => {
    try {
        // make sure is that is user
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Not authorized"
            });
        }
        // make sure from role
        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin access only"
            });
        }
        // if Admin continue
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = isAdmin;