const express = require("express");
const router = express.Router();
const userModel = require("../models/user");

router.use(express.json());

router.get("/user",async (req, res) => {
  try {
    const api_key = req.headers.api_key;
    if (api_key !== "890890890") {
      res.redirect("/not-found");
    }

    const user = await userModel.find({}, 'name email');
    res.json(user);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router