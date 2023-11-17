const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/user");
dotenv.config();

exports.auth = async function (req, res, next) {
  console.log("come till Auth");
  try {
    const key = process.env.JWT_SECRET;

    const token = req.headers.auth;
    const user = jwt.verify(token, key);
    if (user) {
      const findUser = await User.findOne({
        where: { id: user.id, name: user.name },
      });
      if (findUser) {
        req.user = findUser;
        console.log("found User id");
        next();
      } else res.send({ success: false, message: "user not found" });
    } else res.send({ success: false, message: "token not verified" });
  } catch (err) {
    console.log(err);
    res.send({ success: false, message: "its an error" });
  }
};
