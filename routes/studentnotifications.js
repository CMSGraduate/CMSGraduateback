const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Notification = require("../models/studentnotification");
const auth = require("../auth/authenticate");
const notification = require("../models/studentnotification");

//Admin Use Routes
router.post("/send-to-/", auth.verifyUser, async (req, res) => {
  const Today = new Date();
  const year = Today.getFullYear();
  const month = Today.getMonth() + 1;
  const day = Today.getDay()+1;
  const date = day + "-" + month + "-" + year;
  console.log("hello",req.body)
  try {
    console.log(req.user);
    const obj = {
      notification: req.body.notification,
      notificationtitle:req.body.title,
      createdBy: req.user.student_id,
      creationDate: date,
      notificationDate:req.body.notificationDate,
      isRead: false,
    };
    const notifi = await Notification.create(obj);
    console.log("notification made", notifi);
    res.status("201").json(notifi);
  } catch (err) {
    console.log(err);
  }
});



router.get("/studentMS/", auth.verifyUser, async (req, res) => {
  try {
    const MS = await User.find({ faculty_id: null })
      .populate("student_id")
      .populate({
        path: "student_id",
        model: "Student",
        populate: { path: "program_id", model: "Program" },
      });
    const arr = MS.filter((x) => {
      if (
        x?.student_id?.program_id?.programShortName.toLowerCase().includes("ms")
      )
        return x;
    });
    res.status(200).json(arr);
  } catch (err) {
    console.log(req.user);

    console.log(err);
  }
});

router.get("/studentPHD/", auth.verifyUser, async (req, res) => {
  try {
    const PHD = await User.find({ faculty_id: null })
      .populate("student_id")
      .populate({
        path: "student_id",
        model: "Student",
        populate: { path: "program_id", model: "Program" },
      });
    const arr = PHD.filter((x) => {
      if (
        x?.student_id?.program_id?.programShortName
          .toLowerCase()
          .includes("phd")
      )
        return x;
    });
    res.status(200).json(arr);
  } catch (err) {
    console.log(err);
  }
});

router.get("/allStudents/", auth.verifyUser, async (req, res) => {
  try {
    const students = await User.find({ faculty_id: null })
      .populate("student_id")
      .populate({
        path: "student_id",
        model: "Student",
        populate: { path: "program_id", model: "Program" },
      });
    res.status(200).json(students);
  } catch (err) {
    console.log(err);
  }
});

//Student Use Routes

router.get("/getNotification/", auth.verifyUser, async (req, res) => {
  try {
    console.log("re,",req.user._id)
    const notifi = await notification.find({ createdBy: req.body.student_id });
    res.status(200).json(notifi);
  } catch (err) {
    console.log(err);
  }
});

router.get("/getAllNotification/", auth.verifyUser, async (req, res) => {
  try {
    await Notification.find({}).populate('createdBy')
    .then((notifi)=>{
      console.log("notifi",notifi)
      res.status(200).json(notifi);
    }).catch((err)=>{
      console.log(err);

    })
    
  }
   catch (err) {
    console.log(err);
  }
});
router.delete("/Markasread/:id", auth.verifyUser, async (req, res) => {
  try {
    const del = await notification.deleteOne({ _id: req.params.id });
    console.log("del", del);
    res.status(204).json(del);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
