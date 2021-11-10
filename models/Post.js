const { model, Schema } = require("mongoose");

const PostSchema = new Schema({
  body: String,
  userName: String,
  createdAt: { type: Date, default: Date.now },
  comments: [
    {
      body: String,
      userName: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  likes: [
    {
      userName: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = model("Post", PostSchema);
