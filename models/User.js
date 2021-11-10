const { model, Schema } = require("mongoose");

const UserSchema = new Schema({
  userName: String,
  password: String,
  email: String,
  createdAt: Date,
});

module.exports = model("User", UserSchema);
