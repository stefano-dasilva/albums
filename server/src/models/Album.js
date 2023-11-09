import mongoose from "mongoose";

const AlbumSchema = new mongoose.Schema({
  title: {
    required: true,
    type: String,
  },
  creator_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  date: {
    type: Date,
    required: true,
  },
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: "image" }],
});

export const AlbumModel = mongoose.model("album", AlbumSchema);
