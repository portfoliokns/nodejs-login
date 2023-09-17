const express = require("express");
const router = express.Router();
const userModel = require("../models/user");
const bcrypt = require('bcrypt');

router.use(express.urlencoded({ extended: true }));

router.get("/login", (req, res) => {
  try {
    if (req.session.email) {
      res.redirect("/");
      return;
    }

    const message = [];
    const { email } = {};
    res.render("user/login", { message, email })
  } catch (error) {
    console.log(error);
  }
});

router.post("/login-check", async (req, res) => {
  try {
    const email = req.body.email;
    const user = await userModel.findOne({email: email});
    if (!user) {
      const message = "EmailまたはPasswordが誤っています。"
      res.render("user/login", { email, message });
    }
    
    const password = req.body.password;
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (isPasswordMatch) {
      req.session.email = email;
      res.redirect("/");
    } else {
      const message = "EmailまたはPasswordが誤っています。"
      res.render("user/login", { email, message });
    }
  } catch (error) {
    res.status(500).send('サーバーエラーが発生しました。');
  }
});

router.get("/index", async (req, res) => {
  try {
    if (!req.session.email) {
      res.redirect("/login-message");
      return;
    }
    const email = req.session.email;
    const users = await userModel.find({email: email});
    res.render("user/index", { users });
  } catch (error) {
    console.error(error);
  }
});

router.get("/new", (req, res) => {
  try {
    if (req.session.email) {
      res.redirect("/");
      return;
    }

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
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();
    req.session.email = req.body.email
    res.render("user/registered");
  } catch (error) {
    if (error.name === 'ValidationError') {
      const { name, email, password } = req.body;
      const errors = Object.values(error.errors).map(err => err.message);
      res.render("user/new", { name, email, errors });
    } else {
      res.status(500).send('サーバーエラーが発生しました。');
    }
  }
});

router.get("/logout", (req, res) => {
  try {
    if (!req.session.email) {
      res.redirect("/login-message");
      return;
    }
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
      }
      res.redirect("/logout-message");
    })
  } catch (error) {
    console.log(error);
  }
});

module.exports = router