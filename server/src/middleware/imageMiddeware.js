import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadMiddle = upload.single("image");

export { uploadMiddle };
