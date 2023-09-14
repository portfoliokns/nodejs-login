//サーバー設定
const express = require("express");
const app = express();
const PORT = 3000;

//データベース
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://konishi3:password@cluster0.uh1oigt.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("データベース接続に成功しました。"))
  .catch((err) => console.log(err));

//ルーティング
const userRouter = require("./routes/user");
app.use("/user", userRouter);

//テンプレートエンジン
app.set("view engine", "ejs");
app.use(express.static("public"));

//トップページ
app.get("/", (req, res) => {
  res.render("index");
});

// 存在しないページ
app.get("/not-found", (req, res) => {
  res.render("not-found");
});

// 存在しないパスからリダイレクト
app.use((req, res) => {
  res.redirect("/not-found");
});

app.listen(PORT, () => {
  console.log("サーバーが起動しました。");
});