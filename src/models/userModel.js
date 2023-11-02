const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    mobile: { type: String, required: true },
    password: { type: String, required: true },
    profilePic: { type: String },
    otp:{type:String,required:true},
    createdAt: { type: Date, default: Date.now() },
  },
  { timestamps: true, versionKey: false }
); 

const User = mongoose.model("User", userSchema);
module.exports = User;
