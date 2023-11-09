import { AlbumModel } from "../models/Album.js";
import { ImageModel } from "../models/Image.js";
import { UserModel } from "../models/User.js";
import { CommentModel } from "../models/Comment.js";

const createAlbum = async (req, res) => {
  const { title, date, image_description, image_title } = req.body;
  const owner_id = req.id;
  const image = req.file;

  if (!title) {
    return res.status(400).json({ message: "missing title" });
  }
  if (!date) {
    return res.status(400).json({ message: "missing date" });
  }

  if (!image) {
    return res.status(400).json({ message: "missing image" });
  }
  if (!image_description) {
    return res.status(400).json({ message: "missing image description" });
  }
  if (!image_title) {
    return res.status(400).json({ message: "missing image title" });
  }

  try {
    const new_album = new AlbumModel({
      title: title,
      date: date,
      creator_id: owner_id,   
    });

    const new_image = new ImageModel({
      title: image_title,
      date: date,
      description: image_description,
      image: image.buffer,
      owner: owner_id,
    });

    await new_image.save();

    new_album.images.push(new_image._id)
    await new_album.save()

    return res
      .status(201)
      .json({ albumid: new_album._id, message: "new album created" });
  } catch (err) {
    console.log(err);

    return res
      .status(500)
      .json({ message: "internal server error on album creation" });
  }
};
const uploadImage = async (req, res) => {
  const { title, date, description, album_ID } = req.body;
  const image = req.file;
  const user_id = req.id;

  const user = UserModel.findById(user_id);

  if (!user) {
    return res.status(404).json({ message: "user doesn't exists" });
  }

  if (!title || !date || !description || !image || !album_ID) {
    return res.status(400).json({ message: "missing req body or img" });
  }

  try {
    const new_image = new ImageModel({
      title: title,
      date: date,
      description: description,
      image: image.buffer,
      owner: user_id,
    });

    await new_image.save();

    const album = await AlbumModel.findById(album_ID);
    if (!album) {
      return res.status(404).json({ message: "album doesn't exists" });
    }

    album.images.push(new_image);
    await album.save();
    return res.status(201).json({ message: "image succesfully added" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "internal error on uploadImage" });
  }
};
const getAlbums = async (req, res) => {
  try {
    const albums = await AlbumModel.find()
      .populate({
        path: "creator_id",
        select: "username",
      })
      .populate({
        path: "images",
        select: "image",
      });

    return res.status(201).json({ albums: albums });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "error on getAlbums" });
  }
};
const getAlbumdetails = async (req, res) => {
  const { album_ID } = req.query;

  if (!album_ID) {
    return res.status(401).json({ message: "missing album ID" });
  }

  try {
    const album = await AlbumModel.findById(album_ID)
      .populate({
        path: "creator_id",
        select: "username",
      })
      .populate({
        path: "images",
        populate: {
          path: "comments",
          populate: {
            path: "creator",
            select: "username",
          },
        },
      })
      .exec();

    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    return res.status(201).json({ content: album });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "internal error getalbumDetails" });
  }
};

export { createAlbum, uploadImage, getAlbums, getAlbumdetails };
