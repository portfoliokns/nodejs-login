const express = require("express");
const router = express.Router();
const userModel = require("../models/user");
const api_key = "890890890";

router.use(express.json());

router.get("/user",async (req, res) => {
  try {
    const get_key = req.headers.api_key;
    if (!checkApiKey(get_key)) {
      res.redirect("/not-found");
      return;
    }
    const user = await userModel.find({}, 'name email');
    if (user) {
      res.json(user);
    } else {
      res.json("該当する情報はありませんでした");
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/user/:email",async (req, res) => {
  try {
    const get_key = req.headers.api_key;
    if (!checkApiKey(get_key)) {
      res.redirect("/not-found");
      return;
    }
    const email = req.params.email;
    const user = await userModel.findOne({email: email}, 'name email');
    if (user) {
      res.json(user);
    } else {
      res.json("該当する情報はありませんでした");
    }
  } catch (error) {
    console.log(error);
  }
});

function checkApiKey (get_key) {
  if (api_key === get_key) {
    return true;
  }
  return false;
};

module.exports = router