const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/LoginForm');

const Schema=mongoose.Schema;
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Ensure usernames are unique
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure emails are unique
  },
  password: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
  },
  profilePic: String,
});
const Userdata=mongoose.model('userLoginData',UserSchema);

module.exports=Userdata
