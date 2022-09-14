const express = require("express");
const router = express.Router();
const User = require("../models/user");
const auth = require("../auth/authenticate");
const multer = require("multer");
const Student = require("../models/student");
const ThesisSubmission = require("../models/thesisSubmission");
const path = require("path");
const ThesisSchedule = require("../models/thesisSchedule");
const ThesisEvaluation = require("../models/thesisEvaluation");
const EvaluationStatus = require("../models/evaluationStatus");

router.get("/thesis-schedule", auth.verifyUser, (req, res) => {
  ThesisSchedule.find({})
    .populate("student_id")
    .populate("scheduledBy")
    .populate("program_id")
    .then((thesisSchedule) => {
      console.log(thesisSchedule);
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(thesisSchedule);
    })
    .catch((err) => {
      res.setHeader("Content-Type", "application/json");
      res.status(500).json({ success: false, message: err.message });
    });
});

router.post(
  "/add-thesisSchedule",
  auth.verifyUser,

  (req, res) => {
    let body = req.body;
    ThesisSchedule.create({ ...body, scheduledBy: req.user._id })
      .then((thesisSchedule) => {
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(thesisSchedule);
      })
      .catch((err) => {
        res.setHeader("Content-Type", "application/json");
        res.status(500).json({ success: false, message: err.message });
      });
  }
);

router.patch(
  "/update-thesisSchedule/:id",
  auth.verifyUser,

  (req, res) => {
    ThesisSchedule.findByIdAndUpdate(req.params.id, req.body)
      .then(() => {
        res.setHeader("Content-Type", "application/json");
        res.status(200).json({ success: true, message: "Thesis Updated" });
      })
      .catch((err) => {
        res.setHeader("Content-Type", "application/json");
        res.status(500).json({ success: false, message: err.message });
      });
  }
);

router.delete(
  "/delete-thesisSchedule/:id",
  auth.verifyUser,

  (req, res) => {
    ThesisSchedule.findByIdAndDelete(req.params.id)
      .then(() => {
        res.setHeader("Content-Type", "application/json");
        res.status(200).json({ success: true, message: "Thesis Deleted!" });
      })
      .catch((err) => {
        res.setHeader("Content-Type", "application/json");
        res.status(500).json({ success: false, message: err.message });
      });
  }
);

router.post(
  "/add-evaluation",
  auth.verifyUser,

  (req, res) => {
    let body = req.body;
    EvaluationStatus.create({ evaluationStatus: body.evaluationStatus })
      .then((evaluationStatus) => {
        ThesisEvaluation.create({
          ...body,
          evaluationStatus: evaluationStatus?._id,
          evaluator_id: req.user._id,
        })
          .then((thesisEvaluation) => {
            res.setHeader("Content-Type", "application/json");
            res.status(200).json({ thesisEvaluation, evaluationStatus });
          })
          .catch((err) => {
            res.setHeader("Content-Type", "application/json");
            res.status(500).json({ success: false, message: err.message });
          });
      })
      .catch((err) => {
        res.setHeader("Content-Type", "application/json");
        res.status(500).json({ success: false, message: err.message });
      });
  }
);

router.patch(
  "/add-evaluation-go",
  auth.verifyUser,

  (req, res) => {
    let body = req.body;

    ThesisEvaluation.updateMany(
      { schedule_id: body.schedule_id },
      {
        "goEvaluation.isEvaluated": true,
        "goEvaluation.goComment": body.goComment,
        "goEvaluation.goIsRequiredAgain": body.goIsRequiredAgain,
        "goEvaluation.finalRecommendation": body.finalRecommendation,
      }
    )
      .then((thesisEvaluation) => {
        res.setHeader("Content-Type", "application/json");
        res.status(200).json({ thesisEvaluation });
      })
      .catch((err) => {
        res.setHeader("Content-Type", "application/json");
        res.status(500).json({ success: false, message: err.message });
      });
  }
);
// router.patch(
//   "/update-evaluation",
//   auth.verifyUser,

//   (req, res) => {
//     let body = req.body;

//     ThesisEvaluation.findOneAndUpdate(
//       { _id: body.thesisEvaluation_id },
//       {
//         $push: {
//           recommendations: {
//             comment: body.comment,
//             evaluationStatus: body.evaluationStatus,
//             evaluator_id: req.user._id,
//           },
//         },
//       }
//     )
//       .then((thesisSchedule) => {
//         res.setHeader("Content-Type", "application/json");
//         res.status(200).json(thesisSchedule);
//       })
//       .catch((err) => {
//         res.setHeader("Content-Type", "application/json");
//         res.status(500).json({ success: false, message: err.message });
//       });
//   }
// );

router.get("/thesis-evaluation", auth.verifyUser, (req, res) => {
  ThesisEvaluation.find({})
    .populate("evaluator_id evaluationStatus")
    .populate({
      path: "schedule_id",
      populate: [
        {
          path: "student_id",
          populate: {
            path: "program_id",
          },
        },
      ],
    })

    .then((thesisEvaluation) => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(thesisEvaluation);
    })
    .catch((err) => {
      res.setHeader("Content-Type", "application/json");
      res.status(500).json({ success: false, message: err.message });
    });
});

// router.get("/thesis-evaluation", auth.verifyUser, (req, res) => {
//   ThesisEvaluation.find({})
//     .populate("recommendations.evaluator_id recommendations.evaluationStatus")
//     .populate({
//       path: "schedule_id",
//       populate: [
//         {
//           path: "student_id",
//           model: "Student",
//         },
//         { path: "program_id", model: "Program" },
//         { path: "scheduledBy", model: "User" },
//       ],
//     })
//     .then((thesisEvaluation) => {
//       res.setHeader("Content-Type", "application/json");
//       res.status(200).json(thesisEvaluation);
//     })
//     .catch((err) => {
//       res.setHeader("Content-Type", "application/json");
//       res.status(500).json({ success: false, message: err.message });
//     });
// });

//get thesisSubmissions

router.get("/submitted-thesis", auth.verifyUser, (req, res) => {
  ThesisSubmission.find({})
    .populate({
      path: "student_id",
      populate: {
        path: "program_id session_id supervisor_id coSupervisor_id",
      },
    })
    .populate("supervisor_id coSupervisor_id")
    .then((thesisSubmission) => {
      console.log("submitted", thesisSubmission);
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(thesisSubmission);
    })
    .catch((err) => {
      res.setHeader("Content-Type", "application/json");
      res.status(500).json({ success: false, message: err.message });
    });
});

router.put("/update-thesis-status", (req, res) => {
  ThesisSubmission.findOneAndUpdate(
    { student_id: req.body.student_id },
    { thesisStatus: req.body.status }
  )
    .then(() => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json({ success: true, message: "Status Updated" });
    })
    .catch((err) => {
      console.log(err.message);
      res.setHeader("Content-Type", "application/json");
      res.status(500).json({ success: false, message: err.message });
    });
});

router.post("/add-deadline", auth.verifyUser, (req, res) => {
  Deadline.create(req.body)
    .then((deadline) => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(deadline);
    })
    .catch((err) => {
      res.setHeader("Content-Type", "application/json");
      res.status(500).json({ success: false, message: err.message });
    });
});

router.get("/get-deadlines", auth.verifyUser, async (req, res, next) => {
  try {
    const deadlines = await Deadline.find({})
      .populate("program_id")
      .populate("createdBy")
      .exec();
    res.json(deadlines);
  } catch (error) {
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
});

router.delete(
  "/delete-deadline/:id",
  auth.verifyUser,
  async (req, res, next) => {
    try {
      await Deadline.findByIdAndDelete(req.params.id);
      res.json({ msg: "Deadline Deleted" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: err.message });
    }
  }
);

router.patch(
  "/update-deadline/:id",
  auth.verifyUser,
  async (req, res, next) => {
    try {
      await Deadline.findByIdAndUpdate(req.params.id, req.body);
      res.json({ msg: "Deadline Updated" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: err.message });
    }
  }
);

module.exports = router;
