import { UserModel } from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(401).json({ message: "missing credentials" });
  }

  try {
    const user = await UserModel.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ message: "user does not exists" });
    }

    const matchingPass = await bcrypt.compare(password, user.password);

    if (!matchingPass) {
      return res.status(401).json({ message: "password does not match" });
    }
    const userID = user._id;

    const token = jwt.sign({ id: userID }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    res.cookie(String(userID), token, {
      path: "/",
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "lax",
    });
    return res.status(201).json({ token, userID: userID , username : user.username});
  } catch (err) {
    console.log(err);

    return res.status(500).json({ message: "internal server error on login" });
  }
};

const register = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    if (!username || !password || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

const user = await UserModel.findOne({
  $or: [{ username: username }, { email: email }],
}).exec();

    if (user) {
      return res
        .status(400)
        .json({ message: `user   already exists` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      username: username,
      password: hashedPassword,
      email: email,
    });

    await newUser.save();

    const user_id = newUser._id;
    const token = jwt.sign({ id: user_id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    res.cookie(String(user_id), token, {
      path: "/",
      maxAge : 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "lax",
    });

    return res.status(201).json({ token, userID: user_id , username : newUser.username});
  } catch (error) {
    console.log(err);

    return res
      .status(500)
      .json({ message: " internal server error on register" });
  }
};

const logout = async (req, res) => {
  try {
    const userId = req.id;

    res.clearCookie(String(userId));
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log(err);

    return res.status(500).json({ message: "Error during logout" });
  }
};
export { login, register, logout };
