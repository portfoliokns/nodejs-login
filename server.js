//サーバー設定
const express = require("express");
const app = express();
const PORT = 3000;

//データベース
const mongoose = require("mongoose");
const ID = process.env.MONGO_DB_ID;
const Password = process.env.MONGO_DB_PASSWORD;
mongoose.connect(
  `mongodb+srv://${ID}:${Password}@cluster0.uh1oigt.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => console.log("データベース接続に成功しました。"))
  .catch((err) => console.log(err));

//セッション
const session = require('express-session');
app.use(session({
  secret: 'jkokmwijioo9w93jawenci', // 秘密鍵は任意のものに要変更
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60
  } 
}));

//ルーティング
const userRouter = require("./routes/user");
app.use("/user", userRouter);

//テンプレートエンジン
app.set("view engine", "ejs");
app.use(express.static("public"));

//トップページ
app.get("/", (req, res) => {
  if (!req.session.email) {
    res.redirect("/login-message");
    return;
  }
  res.render('public/layout', {
    partialTemplate: '../index'
  });
});

//ログインメッセージ
app.get("/login-message", (req, res) => {
  res.render('public/layout', {
    partialTemplate: '../login-message'
  });
});

//ログアウト完了ページ
app.get("/logout-message", (req, res) => {
  res.render('public/layout', {
    partialTemplate: '../logout-message'
  });
});

// 存在しないページ
app.get("/not-found", (req, res) => {
  res.render('public/layout', {
    partialTemplate: '../not-found'
  });
});

// 存在しないパス
app.use((req, res) => {
  res.redirect("/not-found");
});

app.listen(PORT, () => {
  console.log("サーバーが起動しました。");
});