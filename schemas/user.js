const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  user_name: {
    type: String,
    required: true,
    unique: true
  },
  user_id: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("User", UserSchema);
