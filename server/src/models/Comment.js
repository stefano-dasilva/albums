import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  text: {
    required: true,
    type: String,
  },
  date: {
    required: true,
    type: Date,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "user", 
  },
});

export const CommentModel = mongoose.model("comment",CommentSchema)