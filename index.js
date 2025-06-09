const express = require("express");
require("dotenv").config();
const bodyparser = require("body-parser");
const app = express();
const form = require("./routes/form");
const MongoConnect = require("./database/mongoConnect").connectMongo;
const multer = require("multer");
const fs = require("fs");
const helmet = require("helmet");
const userAction = require("./routes/userAction");
const path = require("path");
const cors = require("cores");
app.use(
  cors({
    origin: "https://instagram-frontend-5hzb.onrender.com",
  })
);
// const url = cloudinary.url(); // for cloudinary
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "trusted-cdn.com"],
    },
  })
);
app.use(helmet.frameguard({ action: "deny" }));
app.use(helmet.xssFilter());
app.use(helmet.noSniff());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/tmp");
  },
  filename: (req, file, cb) => {
    // Use a unique filename to avoid conflicts
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and GIF files are allowed"), false);
  }
};

// Initialize Multer
const upload = multer({ storage: storage, fileFilter: fileFilter });
app.use(multer({ storage: storage }).single("image"));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.use("/uploads", express.static("uploads"));
app.use(form);
app.use(userAction);

app.use((error, req, res, next) => {
  console.log("dknkdkfndk");
  res.status(error.statusCode || 500).json({
    message: error.message || "Something went wrong",
  });
});

const PORT = process.env.PORT || 5000;

MongoConnect(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
