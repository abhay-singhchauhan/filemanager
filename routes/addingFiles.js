const { Router } = require("express");
const app = Router();
const {
  addFolder,
  getData,
  addFile,
  homePage,
  deleteFunc,
} = require("../controllers/addingFiles");
const { auth } = require("../auth/auth");

app.post("/add-folder", auth, addFolder);
app.post("/get-list", auth, getData);
app.post("/add-file", auth, addFile);
app.delete("/delete", auth, deleteFunc);
app.get("/home", auth, homePage);
module.exports = app;
