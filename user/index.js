const express = require("express");
const authenticateToken = require("../middleware/authenticate");
const User = require("./model/user");
const CardSchema = require("../Card/model");

const userApp = express.Router();

userApp.use(express.json());

userApp.get("/profile", authenticateToken, async (req, res) => {
  const id = req.user.id;

  const val = await User.findOne({ id });

  delete val.password;

  if (!val) {
    return res.json({ status: "failed", msg: "No user present" });
  }

  return res.json({ status: "ok", data: val });
});

userApp.post("/edit", authenticateToken, async (req, res) => {
  const id = req.user?.id;

  const { username, email, phone, password } = req.body;

  if (!id) {
    return res.json({ status: "failed", msg: "User ID not present." });
  }

  if (password) {
    delete req.body.password;
  }

  const size = Object.keys(req.body).length;

  if (size == 0) {
    return res.json({ status: "failed", msg: "Nothing to update" });
  }

  if (username && (await User.findOne({ username })) != null) {
    return res.json({ status: "failed", msg: "Username already exists" });
  }

  if (phone && (await User.findOne({ phone })) !== null) {
    return res.json({ status: "failed", msg: "Mobile number already exists" });
  }

  if (email && (await User.findOne({ email })) !== null) {
    return res.json({ status: "failed", msg: "Email already exists" });
  }

  try {
    await User.updateOne({ id }, { ...req.body });
  } catch (e) {
    console.log(e);
    return res.json({ status: "failed", msg: "Server error" });
  }

  return res.json({ status: "ok", msg: "Successfully updated" });
});

userApp.get("/other/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;

  const val = await User.findOne({ id });

  delete val.password;

  if (!val) {
    return res.json({ status: "failed", msg: "No user present" });
  }

  return res.json({ status: "ok", data: val });
});

userApp.get("/all/:page", authenticateToken, async (req, res) => {
  const page = req.params.page;

  const val = await User.find({})
    .limit(50)
    .skip(page * 50)
    .sort({ created: -1 });

  if (!val) {
    return res.json({ status: "failed", msg: "No user present" });
  }

  return res.json({ status: "ok", data: val });
});

userApp.get("/search/:text", authenticateToken, async (req, res) => {
  const text = req.params.text;

  const val = await User.find({ username: new RegExp(text, "i") }).sort({
    created: -1,
  });

  if (!val) {
    return res.json({ status: "failed", msg: "No user present" });
  }

  return res.json({ status: "ok", data: val });
});

userApp.get("/card/:id", authenticateToken, async (req, res) => {
  const id = req.user.id;

  try {
    const data = await CardSchema.find({ created_by: id });
    return res.send({ status: "ok", data });
  } catch (e) {
    console.log(e);
    return res.send({ status: "Failed", msg: "Server error" });
  }
});

module.exports = userApp;
