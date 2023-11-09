import express from "express"
import { verifyToken } from "../middleware/authMiddleware.js"
import { commentImage, getComments } from "../controllers/commentController.js"

const router = express.Router()

router.use(verifyToken)
router.route("/comment").post(commentImage)
router.route("/getcomments").get(getComments)

export {router as comment}