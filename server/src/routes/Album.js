import express from "express"
import { verifyToken } from "../middleware/authMiddleware.js"
import { createAlbum, uploadImage,getAlbums, getAlbumdetails } from "../controllers/albumController.js"
import { uploadMiddle } from "../middleware/imageMiddeware.js"

const router = express.Router()

router.use(verifyToken)
router.route("/create").post(uploadMiddle,createAlbum)
router.route("/uploadimage").post(uploadMiddle,uploadImage)
router.route("/getalbums").get(getAlbums)
router.route("/detail").get(getAlbumdetails)

export {router as album}