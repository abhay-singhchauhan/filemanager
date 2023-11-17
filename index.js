const express = require("express");
const path = require("path");
const app = express();
const db = require("./db/db");
const User = require("./models/user");
const bodyParser = require("body-parser");
const loginSignupRoute = require("./routes/login-signup");
const addingFiles = require("./routes/addingFiles");

app.use(express.json());

app.use(addingFiles);
app.use(loginSignupRoute);

app.use((req, res) => {
  console.log(">>>>>>>>>>", req.url);
  let str = `/views/index/index.html`;
  if (req.url === "/") {
    res.sendFile(path.join(__dirname, str));
  } else {
    console.log(req.url);
    res.sendFile(path.join(__dirname, req.url));
  }
});

db.sync().then(() => {
  app.listen("1000");
});
