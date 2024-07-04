const jwt = require("jsonwebtoken");

// Sample user data
const user = {
  id: 123,
  username: "john_doe",
  email: "john.doe@example.com",
};

// Secret key for JWT signing (replace with your own secret key)
const secretKey = "mysecretkey";

// Generate a JWT token with the user data
const token = jwt.sign(user, secretKey, { expiresIn: "1h" });

console.log("Generated JWT token:", token);

// Verify the JWT token
jwt.verify(token, secretKey, (err, decoded) => {
  if (err) {
    console.error("JWT verification failed:", err.message);
    return;
  }

  console.log("Decoded JWT token:", decoded);
});
