const express = require("express");
const router = express.Router();
const userModel = require("../models/user");

router.use(express.urlencoded({ extended: true }));

router.get("/", (req, res) => {
  try {
    res.redirect("user/new");
  } catch (error) {
    console.log(error);
  }
})

router.get("/new", (req, res) => {
  try {
    const { name, email, password } = {};
    const errors = [];
    res.render("user/new", { name, email, password, errors });
  } catch (error) {
    console.log(error);
  }
});

router.post("/create", async (req, res) => {
  try {
    const user = new userModel(req.body);
    await user.save();
    res.redirect("registered");
  } catch (error) {
    if (error.name === 'ValidationError') {
      const { name, email, password } = req.body;
      const errors = Object.values(error.errors).map(err => err.message);
      res.render("user/new", { name, email, password, errors });
    } else {
      res.status(500).send('サーバーエラーが発生しました。');
    }
  }
});

router.get("/registered", (req, res) => {
  try {
    res.render("user/registered");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router