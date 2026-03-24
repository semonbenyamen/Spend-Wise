const multer = require("multer");
const path = require("path");

// place to save image
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        // img name + upload time + original file name
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Make sure the file is an image only
const fileFilter = (req, file , cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only images are allowed"), false);
    }
};

const upload = multer ({ storage: storage, fileFilter: fileFilter });

module.exports = upload ;

