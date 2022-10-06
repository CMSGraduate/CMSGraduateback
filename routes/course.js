const express = require("express");
const router = express.Router();
const User = require("../models/user");
const auth = require("../auth/authenticate");
const Course = require("../models/course");

//course Use Routes
router.get("/getMScourses", auth.verifyUser, (req, res) => {
         Course.find({level:"MS"})
          .then((courses) => {
            res.setHeader("Content-Type", "application/json");
            res.status(200).json({ success: true,courses });
          })
          .catch((err) => {
            res.setHeader("Content-Type", "application/json");
            res.status(500).json({ success: false, message: err.message });
          });
});

router.get("/getPHDcourses", auth.verifyUser, async (req, res) => {
    Course.find({ level: "PHD"})
      .then((courses) => {
        res.setHeader("Content-Type", "application/json");
        res.status(200).json({ success: true,courses });
      })
      .catch((err) => {
        res.setHeader("Content-Type", "application/json");
        res.status(500).json({ success: false, message: err.message });
      });
});

router.get("/getCourses", auth.verifyUser, async (req, res) => {
  Course.find({})
    .then((courses) => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json({ success: true,courses });
    })
    .catch((err) => {
      res.setHeader("Content-Type", "application/json");
      res.status(500).json({ success: false, message: err.message });
    });
});
router.patch(
  "/updatecourse/:id",
  auth.verifyUser,
  async (req, res, next) => {
    try {
      const programe = await Course.findByIdAndUpdate(req.params.id, req.body);
      res.json({ msg: "Course Updated" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: err.message });
    }
  }
);
router.delete(
  "/deletecourse/:id",
  auth.verifyUser,
  auth.checkAdmin,
  async (req, res, next) => {
    try {
      const programe = await Course.findByIdAndDelete(req.params.id);
      res.json({ msg: "Course Deleted" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: err.message });
    }
  }
);
module.exports = router;
