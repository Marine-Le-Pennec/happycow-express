const mongoose = require("mongoose");

const User = mongoose.model("User", {
  username: String,
  email: String,
  vegetype: String,
  hash: String,
  salt: String,
  token: String,
  city: String,
  birthday: Number,
});
module.exports = User;
