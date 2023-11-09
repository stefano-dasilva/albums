import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
  title: {
    required: true,
    type: String,
  },
  date: {
    required: true,
    type: Date,
  },
  description: {
    required: true,
    type: String,
  },
  image: {
    required: true,
    type: Buffer,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comment",
    },
  ],
  
});

export const ImageModel = mongoose.model("image", ImageSchema);
