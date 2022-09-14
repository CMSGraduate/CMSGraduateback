const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Announcement = require("../models/announcement");
const auth = require("../auth/authenticate");

//Admin Use Routes
router.get("/", auth.verifyUser, async (req, res) => {
  try {
    const announcement = await Announcement.find({});
    res.status(200).json(announcement);
  } catch (err) {
    console.log(err);
  }
});

router.post("/send", auth.verifyUser, async (req, res) => {
  try {
    const announce = await Announcement.create({
      announcement: req.body.announcement,

      createdBy: req.user._id,
      isActive: true,
      isRead: false,
    });

    console.log("announcement made", announce);
    res.status(201).json(announce);
  } catch (err) {
    res.status(400).json(err);
    console.log(err);
  }
});
router.patch("/update/:id", auth.verifyUser, async (req, res) => {
  try {
    const announce = await Announcement.findOneAndUpdate(
      { _id: req.params.id },
      req.body
    );

    console.log("announcement made", announce);
    res.status(201).json(announce);
  } catch (err) {
    res.status(400).json(err);
    console.log(err);
  }
});

//Student Use Routes

router.delete("/delete/:id", auth.verifyUser, async (req, res) => {
  try {
    const del = await Announcement.deleteOne({ _id: req.params.id });
    console.log("del", del);
    res.status(204).json(del);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
