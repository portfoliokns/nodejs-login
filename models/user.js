const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    validate(value){
      if(value.length > 20) throw new Error("名前は20文字以内で入力してください。");
    }
  },
  email: {
    type: String,
    required: true,
    validate(value){
      if(value.length > 60) throw new Error("メールアドレスは60文字以内で入力してください。");
    }
  },
  password: {
    type: String,
    required: true,
    validate(value){
      if(value.length < 8) throw new Error("パスワードは8文字以上で入力してください。");
    }
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;