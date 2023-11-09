import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { auth } from "./routes/Auth.js";
import { album } from "./routes/Album.js";
import { comment } from "./routes/Comment.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser());

app.use("/auth",auth)
app.use("/album",album)
app.use("/",comment)

mongoose.connect(process.env.MONGO_URL);
app.listen(3001, () => console.log("listening..."));
