const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();
const port = 3000;

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "views"); // Specify the destination directory for uploads
  },
  filename: function (req, file, cb) {
      let modifiedFileName = file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      console.log(modifiedFileName);
    cb(
      null, 
      modifiedFileName
    );
  },
});

const upload = multer({ storage: storage });

// Set up EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware to serve static files from the public folder
app.use(express.static(path.join(__dirname, "public")));

// Route to render the form to upload profile picture
app.get("/", (req, res) => {
  res.render("upload2");
});

// Route to handle POST request for uploading profile picture
app.post("/upload", upload.single("profilePic"), (req, res) => {
  res.send("Profile picture uploaded successfully!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
