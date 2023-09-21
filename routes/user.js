const express = require("express");
const router = express.Router();
const userModel = require("../models/user");
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');

router.use(express.urlencoded({ extended: true }));

router.get("/login", (req, res) => {
  try {
    if (req.session.email) {
      res.redirect("/");
      return;
    }

    const errors = [];
    const { email } = {};
    res.render('public/layout', {
      partialTemplate: 'user/login',
      partialCss: 'user/login.css',
      errors, email
    });
  } catch (error) {
    console.log(error);
  }
});

router.post(
  "/login-check",
  [
    body("email")
      .trim()
      .notEmpty().withMessage("メールアドレスを入力してください")
      .custom(async (value, {req}) => {
        const user = await userModel.findOne({email: value});
        if (!user) {
          throw new Error("EmailまたはPasswordが誤っています。");
        }
      }),
    body("password").trim().notEmpty().withMessage("パスワードを入力してください"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const { email } = req.body;
        res.render('public/layout', {
          partialTemplate: 'user/login',
          partialCss: 'user/login.css',
          email, errors: errors.array()
        });
        return;
      }

      const email = req.body.email;
      const user = await userModel.findOne({email: email});
      const password = req.body.password;
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (isPasswordMatch) {
        req.session.email = email;
        res.redirect("/");
      } else {
        const message = "EmailまたはPasswordが誤っています.";
        const loginErrors = [...errors.array(), { msg: message }];
        res.render('public/layout', {
          partialTemplate: 'user/login',
          partialCss: 'user/login.css',
          email, errors: loginErrors
        });
      }
    } catch (error) {
      res.status(500).send('サーバーエラーが発生しました。');
    }
  }
);

router.get("/index", async (req, res) => {
  try {
    if (!req.session.email) {
      res.redirect("/login-message");
      return;
    }
    const email = req.session.email;
    const users = await userModel.find({email: email});
    res.render('public/layout', {
      partialTemplate: 'user/index',
      partialCss: 'user/index.css',
      users
    });
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
    res.render('public/layout', {
      partialTemplate: 'user/new',
      partialCss: 'user/new.css',
      name, email, password, errors
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/create",
  [
    body("name")
      .trim()
      .notEmpty().withMessage("名前を入力してください")
      .isLength({ max: 20 }).withMessage("ユーザー名は20文字以内で入力してください"),
    body("email")
      .trim()
      .notEmpty().withMessage("メールアドレスを入力してください")
      .isLength({ max: 60 }).withMessage("メールアドレスは60文字以内で入力してください"),
    body("password")
      .trim()
      .custom((value, {req}) => {
        if (value.length === 0) {
          throw new Error("パスワードを入力してください")
        } else if (value.length < 8) {
          throw new Error("パスワードは8文字以上で入力してください")
        }
        return true;
      })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const { name, email } = req.body;
        res.render('public/layout', {
          partialTemplate: 'user/new',
          partialCss: 'user/new.css',
          name, email, errors: errors.array()
        });
        return;
      }

      const user = new userModel(req.body);
      user.password = await bcrypt.hash(user.password, 10);
      await user.save();
      req.session.email = req.body.email
      res.render('public/layout', {
        partialTemplate: 'user/registered',
        partialCss: 'user/registered.css'
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        const { name, email } = req.body;
        const errors = Object.values(error.errors).map(err => err.message);
        res.render('public/layout', {
          partialTemplate: 'user/new',
          partialCss: 'user/new.css',
          name, email, errors
        });
      } else {
        res.status(500).send('サーバーエラーが発生しました。');
      }
    }
  }
);

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