import { CommentModel } from "../models/Comment.js";
import { ImageModel } from "../models/Image.js";

const commentImage = async (req, res) => {
  const { image_ID, text, date } = req.body;
  const creator_ID = req.id;

  if (!image_ID || !text || !date) {
    return res.status(401).json({ message: "all fields are required" });
  }

  const image = await ImageModel.findById(image_ID);

  if (!image) {
    return res.status(404).json({ message: "image does not exists" });
  }

  try {
    const new_comment = new CommentModel({
      text: text,
      date: date,
      creator: creator_ID,
    });

    await new_comment.save();

    image.comments.push(new_comment);
    await image.save();

    return res.status(201).json({ message: "comment successfully created" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "internal error on createcomment" });
  }
};

const getComments = async () => {};

export { commentImage, getComments };
