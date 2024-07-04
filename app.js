const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const User =require('./User.js');
const multer = require("multer");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Set EJS as the view engine
app.use(cookieParser());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));
// Serve static files from the 'public' directory

app.use(express.static("views"));

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "views"); // Specify the destination directory for uploads
  },
  filename: function (req, file, cb) {
    
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      
    );
  },
});

const upload = multer({ storage: storage });

// Set up EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware to serve static files from the public folder
app.use(express.static(path.join(__dirname, "public")));



// Middleware function to check if user is logged in
const checkAuth = (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, "mysecretkey");
            req.user = decoded;
            next(); // Proceed to the next middleware or route handler
        } catch (error) {
            res.redirect("/login"); // Redirect to login page if token is invalid
        }
    } else {
        res.redirect("/login"); // Redirect to login page if no token is found
    }
};

// Route to render the EJS template dynamically with data
app.post("/login", async (req, res) => {


const {username,password } = req.body;


console.log('the user data is ',req.body);


try {
  // Find the user in the database
  const user = await User.findOne({ username });
  console.log("from the db", user.password);

  if (!user) {
   return res.render("error");
  } else {
    bcrypt.compare(password, user.password, function (err, result) {
      if (err) {
        // Handle error
     return   console.error("Error comparing passwords:", err);
        // Send an error response to the client or handle the error accordingly
      } else if (result) {
        const token = jwt.sign({ username }, "mysecretkey", {
          expiresIn: "1h",
        });
    res.cookie("token", token);
    return res.render("home");
        // Passwords match, proceed with authentication
        // Send a success response to the client or proceed with authentication logic
      } else {
        // Passwords do not match, handle accordingly (e.g., show error message)
      return res.render("error");

        // Send an error response to the client or handle the error accordingly
      }
    });
  }
} catch (error) {
  // Handle any unexpected errors
  console.error("Error during login:", error);
  return res.render("error");
}
});

app.post("/signup", async (req, res) => {

     const {
       username,
       email,
       password,
       confirmPassword,
       fullName,
       dob,
       gender,
       country,
       terms,
     } = req.body;
 if (password !== confirmPassword) {
   return res.status(400).json({ message: "Passwords do not match" });
 }
     // Check if terms checkbox is checked
     if (!terms) {
       return res
         .status(400)
         .json({ message: "You must agree to the Terms and Conditions" });
     }

     // Create a new user document using the Mongoose model
  
    console.log(req.body);
  // Validate the input

  const existingUser = await User.findOne({ email,username });
  if (existingUser) {
    res.status(400).send("User already exists");
  }
  else{    
    const saltRounds = 10; // You can adjust this value based on your security needs

    bcrypt.hash(password, saltRounds,  async function (err, hash) {
      if (err) {
        // Handle error
      } else {
        // Store the hash in your database or use it as needed
        console.log('The hash password is ',hash); // This is the hashed password you'll store
        const user = new User({
          username,
          email,
          password:hash,
          fullName,
          dob,
          gender,
          country,
        });
        await user.save();
      }
    });
  const token = jwt.sign({ username}, "mysecretkey", {
    expiresIn: "1h",
  });
  res.cookie("token", token);
  res.render('home')
  }
});


app.get("/login", (req, res) => {
    res.render('login')
})
app.get("/about",checkAuth,async (req, res) => {
    const token = req.cookies.token;
 const decoded = jwt.verify(token, "mysecretkey");
 console.log(decoded.username);
 const finduser=await User.findOne({username:decoded.username});
 console.log(finduser);
 
if(finduser){
  res.render('about') 
}else{
 res.render('error')
}
  
}

)
app.get("/contact", checkAuth,async (req, res) => {
  
  const token = req.cookies.token;
  const decoded = jwt.verify(token, "mysecretkey");
  console.log(decoded.username);
  const finduser=await User.findOne({username:decoded.username});
  console.log(finduser);
  
  if(finduser){
    
    res.render("contact");
}else{
 res.render('error')
}
  
})

app.get("/signup", (req, res) => {
  res.render("signup");
});
app.get("/", checkAuth, async(req, res) => {
  const token = req.cookies.token;
  const decoded = jwt.verify(token, "mysecretkey");
  console.log(decoded.username);
  const finduser=await User.findOne({username:decoded.username});
  console.log(finduser);
  
  if(finduser){
    res.render("home");
}else{
 res.render('error')
}
});
app.get("/profile", checkAuth, async (req, res) => {
 const token = req.cookies.token;
 const decoded = jwt.verify(token, "mysecretkey");
 console.log('this is username',decoded.username);
 const finduser = await User.findOne({ username: decoded.username });
 console.log(finduser);

 if (finduser) {
   res.render("profile", {
     decoded,
     profilePic: finduser.profilePic,
   });
 } else {
   res.render("error");
 }



});
app.get("/logout", (req, res) => {
       res.clearCookie("token");
  res.redirect("/login");
})

app.post("/admin", async (req, res) => {
const usename=req.body.username;
const password=req.body.password;

const usern="salim";

const hash = "$2b$10$m5Z1xfGAS4HHBXJy2suFseQs3i7jrCth0XXUAPosP.mLojIRQbrQ6";
 
 if (usename === usern){

   bcrypt.compare(password, hash, async function (err, result) {
     if (err) {
       // render("error");
       console.log("some error occured", err);
     }
     if (result) {
       try {
         const users = await User.find();
         return res.render("allUser", { allUser: users });
         // res.json(users);
       } catch (error) {
         console.error("Error fetching users:", error);
         res.status(500).json({ message: "Error fetching users" });
       }
      }else{
        //send a json response
        res.status(400).json({ message: "Invalid password or username" });
      }
    });
  }else{

 res.status(400).json({ message: "Invalid password or username" });
  }
});

app.get("/admin", (req, res) => {
  res.render('admin')
})
app.get("/forgot-password", (req, res) => {
  res.render("forgot-password");
});

app.post("/forgot-password", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);


    // Validate email format (you can use a validation library or regex)
   

  const user = await User.findOne({ email });
  if (!user) {

    return res.status(404).send("User not found");
  }else{

bcrypt.hash(password, 10, async function (err, hash) {
  
    user.password=hash
    await user.save().then(res.send('code reset successfully'))
  

});
  }
})

// Add a new route for handling search requests
app.post("/search", async (req, res) => {
    const searchQuery = req.body.searchQuery.trim(); 
    console.log(searchQuery);// Get the search query from the request body

    try {
        // Use a regular expression to perform a case-insensitive search
        const users = await User.find({
            $or: [
                { fullName: { $regex: new RegExp(searchQuery, "i") } },
                { email: { $regex: new RegExp(searchQuery, "i") } },
                { username: { $regex: new RegExp(searchQuery, "i") } },
                          ]
        });
console.log('Checking the users from the database',users)

        // Render the same view but with filtered users based on the search query
        res.render("allUser", { allUser: users, searchQuery });
    } catch (error) {
        console.error("Error searching users:", error);
        res.status(500).json({ message: "Error searching users" });
    } 
});

app.post("/upload", upload.single("profilePic"), async (req, res) => {
  console.log("this is the real name ", req.file.filename);
  const token = req.cookies.token;
  const decoded = jwt.verify(token, "mysecretkey");

  try {
    // Assuming req.file.filename contains the uploaded profile picture filename
    const user = await User.findOne({ username: decoded.username });
    if (!user) {
      return res.status(404).send("User not found");
    }
    user.profilePic =req.file.filename;
    await user.save();

    res.send("Profile picture uploaded and saved successfully!");
  } catch (error) {
    console.error("Error updating user with profile picture:", error);
    res.status(500).send("Error uploading profile picture");
  }
});



app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

