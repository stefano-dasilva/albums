import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const cookies = req.headers.cookie;
  if (cookies) {
    const token = cookies.split("=")[1];

    console.log(token);

    if (token) {
      jwt.verify(String(token), process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
          return res.status(403).json({ message: "invalid token" });
        }
        console.log(user.id);
        req.id = user.id;
        next();
      });
    } else {
      return res.status(403).json({ message: "invalid token 1" });
    }
  } else {
    return res.status(403).json({ message: "invalid token 2" });
  }
};
const refrehToken = (req, res, next) => {
  const cookies = req.headers.cookie;
  if (cookies) {
    const prevtoken = cookies.split("=")[1];

    console.log(token);

    if (token) {
      jwt.verify(String(token), process.env.JWT_SECRET_KEY, (err) => {
        if (err) {
          return res.status(400).json({ message: "invaid token" });
        }
        next();
      });
    } else {
      return res.status(400).json({ message: "invaid token" });
    }
  } else {
    return res.status(400).json({ message: "invaid token" });
  }
};

export { verifyToken, refrehToken };
