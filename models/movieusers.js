const mongoose = require("mongoose");

const MovieUsersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  }
});

const MovieUser = mongoose.model("user", MovieUsersSchema);

module.exports = MovieUser;
