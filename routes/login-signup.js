const { Router } = require("express");
const app = Router();
const { signup, login } = require("../controllers/login-signup");

app.post("/signup", signup);
app.post("/login", login);

module.exports = app;
