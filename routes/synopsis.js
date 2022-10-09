const express = require("express");
const router = express.Router();
const User = require("../models/user");
const auth = require("../auth/authenticate");
const multer = require("multer");
const Student = require("../models/student");
const SynopsisSubmission = require("../models/synopsisSubmission");
const Deadline = require("../models/deadline");
const path = require("path");
const thesisSubmission = require("../models/thesisSubmission");
const RebuttalSubmission=require("../models/rebuttal")
const SynopsisSchedule = require("../models/synopsisSchedule");
const SynopsisEvaluation = require("../models/synopsisEvaluation");
const EvaluationStatus = require("../models/evaluationStatus");
const synopsisSchedule = require("../models/synopsisSchedule");
const synopsisEvaluation = require("../models/synopsisEvaluation");
const synopsisSubmission = require("../models/synopsisSubmission");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /docx|pdf|doc/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Please upload pdf or word files", false);
  }
}
var uploadSynopsis = multer({
  storage: storage,
  limits: { fileSize: 100000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).fields([{ name: "synopsisDocument" }, { name: "synopsisPresentation" }]);

var uploadThesis = multer({
  storage: storage,
  limits: { fileSize: 100000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).fields([{ name: "thesisDocument" }, { name: "synopsisNotification" }]);

router.get("/synopsis-schedule", auth.verifyUser, (req, res) => {
  SynopsisSchedule.find({})
    .populate("student_id")
    .populate("scheduledBy")
    .populate("program_id")
    .then((synopsisSchedule) => {
      console.log(synopsisSchedule);
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(synopsisSchedule);
    })
    .catch((err) => {
      res.setHeader("Content-Type", "application/json");
      res.status(500).json({ success: false, message: err.message });
    });
});

router.post(
  "/add-synopsisSchedule",
  auth.verifyUser,

  (req, res) => {
    let body = req.body;
    SynopsisSchedule.create({ ...body, scheduledBy: req.user._id })
      .then((synopsisSchedule) => {
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(synopsisSchedule);
      })
      .catch((err) => {
        res.setHeader("Content-Type", "application/json");
        res.status(500).json({ success: false, message: err.message });
      });
  }
);

router.patch(
  "/update-synopsisSchedule/:id",
  auth.verifyUser,

  (req, res) => {
    SynopsisSchedule.findByIdAndUpdate(req.params.id, req.body)
      .then(() => {
        res.setHeader("Content-Type", "application/json");
        res.status(200).json({ success: true, message: "Schedule Updated" });
      })
      .catch((err) => {
        res.setHeader("Content-Type", "application/json");
        res.status(500).json({ success: false, message: err.message });
      });
  }
);

router.delete(
  "/delete-synopsisSchedule/:id",
  auth.verifyUser,

  (req, res) => {
    SynopsisSchedule.findByIdAndDelete(req.params.id)
      .then(() => {
        res.setHeader("Content-Type", "application/json");
        res.status(200).json({ success: true, message: "Schedule Deleted!" });
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
        SynopsisEvaluation.create({
          ...body,
          evaluationStatus: evaluationStatus?._id,
          evaluator_id: req.user._id,
        })
          .then((synopsisEvaluation) => {
            res.setHeader("Content-Type", "application/json");
            res.status(200).json({ synopsisEvaluation, evaluationStatus });
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

    SynopsisEvaluation.updateMany(
      { schedule_id: body.schedule_id },
      {
        "goEvaluation.isEvaluated": true,
        "goEvaluation.goComment": body.goComment,
        "goEvaluation.goIsRequiredAgain": body.goIsRequiredAgain,
        "goEvaluation.finalRecommendation": body.finalRecommendation,
      }
    )
      .then((synopsisEvaluation) => {
        res.setHeader("Content-Type", "application/json");
        res.status(200).json({ synopsisEvaluation });
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

//     SynopsisEvaluation.findOneAndUpdate(
//       { _id: body.synopsisEvaluation_id },
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
//       .then((synopsisSchedule) => {
//         res.setHeader("Content-Type", "application/json");
//         res.status(200).json(synopsisSchedule);
//       })
//       .catch((err) => {
//         res.setHeader("Content-Type", "application/json");
//         res.status(500).json({ success: false, message: err.message });
//       });
//   }
// );

router.get("/synopsis-evaluation", auth.verifyUser, (req, res) => {
  SynopsisEvaluation.find({})
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

    .then((synopsisEvaluation) => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(synopsisEvaluation);
    })
    .catch((err) => {
      res.setHeader("Content-Type", "application/json");
      res.status(500).json({ success: false, message: err.message });
    });
});

// router.get("/synopsis-evaluation", auth.verifyUser, (req, res) => {
//   SynopsisEvaluation.find({})
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
//     .then((synopsisEvaluation) => {
//       res.setHeader("Content-Type", "application/json");
//       res.status(200).json(synopsisEvaluation);
//     })
//     .catch((err) => {
//       res.setHeader("Content-Type", "application/json");
//       res.status(500).json({ success: false, message: err.message });
//     });
// });

router.post(
  "/submit-synopsis",
  auth.verifyUser,
  auth.checkStudent,
  async (req, res) => {
    uploadSynopsis(req, res, async function (err) {
      const { synopsisTitle, supervisor, coSupervisor, synopsisTrack } =
        req.body;

      console.log(req.body);
      console.log(req.files);
      if (err instanceof multer.MulterError) {
        console.log("mul", err);

        res.setHeader("Content-Type", "application/json");

        return res.status(500).json({ success: false, message: err });
      } else if (err) {
        console.log("500", err);
        res.setHeader("Content-Type", "application/json");

        return res.status(500).json({ success: false, message: err });
      } else {
        let studId = await User.findById(
          { _id: req.user._id },
          { student_id: 1 }
        );
        let s_id = await User.findById({ _id: supervisor }, { faculty_id: 1 });
        let cs_id = await User.findById(
          { _id: coSupervisor },
          { faculty_id: 1 }
        );

        SynopsisSubmission.create({
          student_id: studId.student_id,
          supervisor_id: s_id.faculty_id,
          coSupervisor_id: cs_id.faculty_id,
          synopsisTitle,
          synopsisStatus: "Unscheduled",
          SpecilizationTrack: synopsisTrack,
          isActive: false,
          synopsisFileName: `public/uploads/${req.files["synopsisDocument"][0].filename}`,
          synopsisFile:req.body.file,
          synopsisPresentationFileName: `public/uploads/${req.files["synopsisPresentation"][0].filename}`,
        })
          .then((ress) => {
            res.setHeader("Content-Type", "application/json");
            res.status(200).json({ success: true, message: "Submitted",data: ress});
          })
          .catch((err) => {
            console.log(err.message);
            res.setHeader("Content-Type", "application/json");
            res.status(500).json({ success: false, message: err.message });
          });
      }
    });
  }
);


router.post(
  "/submit-synopsisfile",
  auth.verifyUser,
  auth.checkStudent,
  async (req, res) => {
    uploadSynopsis(req, res, async function (err) {
     console.log("ehevh")

      if (err instanceof multer.MulterError) {
        console.log("mul", err);

        res.setHeader("Content-Type", "application/json");

        return res.status(500).json({ success: false, message: err });
      } else if (err) {
        console.log("500", err);
        res.setHeader("Content-Type", "application/json");

        return res.status(500).json({ success: false, message: err });
      } else {
       console.log("synopsis upfate",req.body._id)
        SynopsisSubmission.findOneAndUpdate({
          _id: req.body._id},{
            synopsisFile:req.body.file
          })
          .then(() => {
            res.setHeader("Content-Type", "application/json");
            res.status(200).json({ success: true, message: "Submitted" });
          })
          .catch((err) => {
            console.log(err.message);
            res.setHeader("Content-Type", "application/json");
            res.status(500).json({ success: false, message: err.message });
          });
      }
    });
  }
);
//post rebuttal
router.post(
  "/submit-rebuttal",
  auth.verifyUser,
  auth.checkStudent,
  async (req, res) => {
    uploadSynopsis(req, res, async function (err) {
      const { synopsisTitle, supervisor, coSupervisor, synopsisTrack ,schedule_id,evaluation_id} =
        req.body;

      console.log(req.body);
      console.log(req.files);
      if (err instanceof multer.MulterError) {
        console.log("mul", err);

        res.setHeader("Content-Type", "application/json");

        return res.status(500).json({ success: false, message: err });
      } else if (err) {
        console.log("500", err);
        res.setHeader("Content-Type", "application/json");

        return res.status(500).json({ success: false, message: err });
      } else {
        let studId = await User.findById(
          { _id: req.user._id },
          { student_id: 1 }
        );
        let s_id = await User.findById({ _id: supervisor }, { faculty_id: 1 });
        let cs_id = await User.findById(
          { _id: coSupervisor },
          { faculty_id: 1 }
        );

        RebuttalSubmission.create({
          student_id: studId.student_id,
          supervisor_id: s_id.faculty_id,
          coSupervisor_id: cs_id.faculty_id,
          synopsisTitle,
          synopsisStatus: "Unscheduled",
          SpecilizationTrack: synopsisTrack,
          isActive: false,
          synopsisFileName: `public/uploads/${req.files["synopsisDocument"][0].filename}`,
          synopsisPresentationFileName: `public/uploads/${req.files["synopsisPresentation"][0].filename}`,
          schedule_id:schedule_id,
          evaluation_id:evaluation_id
        })
          .then(() => {
            res.setHeader("Content-Type", "application/json");
            res.status(200).json({ success: true, message: "Submitted" });
          })
          .catch((err) => {
            console.log(err.message);
            res.setHeader("Content-Type", "application/json");
            res.status(500).json({ success: false, message: err.message });
          });
      }
    });
  }
);
//get synopsisSubmissions

router.get("/submitted-synopsis", auth.verifyUser, async(req, res) => {
  var array;

  await SynopsisSubmission.find({})
    
    .populate("supervisor_id coSupervisor_id student_id")
    .populate({
      path: "student_id",
     
          populate: {
            path: "program_id",
          },
       
      
    })
    .then((synopsisSubmission) => {
      console.log("submitted", synopsisSubmission);
      
      console.log("shgyehg",synopsisSubmission)
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(synopsisSubmission);
    })
    
    .catch((err) => {
      res.setHeader("Content-Type", "application/json");
      res.status(500).json({ success: false, message: err.message });
    });
});

//get rebuttals
router.get("/student-rebuttals", auth.verifyUser, (req, res) => {
  console.log("howdy")
  RebuttalSubmission.find({})
    .populate(
     "program_id session_id supervisor_id coSupervisor_id schedule_id evaluation_id student_id")
      
    //.populate("supervisor_id coSupervisor_id schedule_id evaluation_id")
    .then((synopsisSubmission) => {
      console.log("submitted", synopsisSubmission);
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(synopsisSubmission);
    })
    .catch((err) => {
      res.setHeader("Content-Type", "application/json");
      res.status(500).json({ success: false, message: err.message });
    });
});
router.post(
  "/submit-thesis",
  auth.verifyUser,
  auth.checkStudent,
  async (req, res) => {
    uploadThesis(req, res, async function (err) {
      const { thesisTitle, supervisor, coSupervisor, thesisTrack } = req.body;

      console.log(req.body);
      console.log(req.files);
      if (err instanceof multer.MulterError) {
        console.log("mul", err);

        res.setHeader("Content-Type", "application/json");

        return res.status(500).json({ success: false, message: err });
      } else if (err) {
        console.log("500", err);
        res.setHeader("Content-Type", "application/json");

        return res.status(500).json({ success: false, message: err });
      } else {
        let studId = await User.findById(
          { _id: req.user._id },
          { student_id: 1 }
        );
        let s_id = await User.findById({ _id: supervisor }, { faculty_id: 1 });
        let cs_id = await User.findById(
          { _id: coSupervisor },
          { faculty_id: 1 }
        );

        thesisSubmission
          .create({
            student_id: studId.student_id,
            supervisor_id: s_id.faculty_id,
            coSupervisor_id: cs_id.faculty_id,
            thesisTitle,
            thesisStatus: "Unscheduled",
            SpecilizationTrack: thesisTrack,
            isActive: false,
            thesisFileName: `public/uploads/${req.files["thesisDocument"][0].filename}`,
            synopsisNotification: `public/uploads/${req.files["synopsisNotification"][0].filename}`,
          })
          .then(() => {
            res.setHeader("Content-Type", "application/json");
            res.status(200).json({ success: true, message: "Submitted" });
          })
          .catch((err) => {
            console.log(err.message);
            res.setHeader("Content-Type", "application/json");
            res.status(500).json({ success: false, message: err.message });
          });
      }
    });
  }
);

router.put("/update-synopsis-status", (req, res) => {
  SynopsisSubmission.findOneAndUpdate(
    { student_id: req.body.student_id },
    { synopsisStatus: req.body.status }
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



//verify rebuttle
router.put("/student-verify-rebuttals/:id", (req, res) => {
  console.log("req.body",req.body.data[0])
  SynopsisEvaluation.findOneAndUpdate(
    { _id: req.params.id },
    { goEvaluation:req.body.data[0]}
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

router.get(
  "/get-deadlines",
  auth.verifyUser,

  async (req, res, next) => {
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
  }
);

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

router.get(
  '/student-evaluation/:id',
  async (req,res) => {
    try{
    //   await SynopsisEvaluation.findById({ _id: req.params.id }).populate("evaluationStatus")
    //   await SynopsisEvaluation.find({}).populate("evaluationStatus")
    //   .then((data) => {
    //     res.json({'data': data})
    //   }).catch((err) => {

    //   })
    // }catch(err){

    // }

    var status = ''
    await SynopsisEvaluation.findById({ _id: req.params.id }).populate("evaluationStatus")
      .then((data) => {
        if(data.evaluationStatus.evaluationStatus.includes('Major') || data.evaluationStatus.evaluationStatus.includes('major')){
          status = "fail"
          // res.json({'data': data , 'status': 'Fail'})
        }else{
          status = "pass"
          // res.json({'status': 'Pass'}) 
        }

       console.log("data.schedule_id: ", data.schedule_id )

        SynopsisSchedule.findById({_id: data.schedule_id }).exec(function(err,data2){
        console.log("Schedule.student_id: ", data2.student_id)
        SynopsisSubmission.findOneAndUpdate({student_id: data2.student_id}, {status: status}).exec(function(err, resData){
          res.json({ 'message':"Status Changed!", 'status': status })
        })
        
       })
      
      
      }).catch((err) => {

            })
          }catch(err){
      
          }
  })

  router.get('/student-synopsis-submission/:id',auth.verifyUser,async (req,res) => {
    try{
      var msg;
      var sub
      await synopsisSubmission.findOne({student_id:req.params.id}).then((re)=>{
        sub=re;
       })
      console.log("yolo",req.params.id)
      synopsisEvaluation.aggregate([{
        $lookup:{
            from:'synopsisschedules',
            localField:'schedule_id',
            foreignField:'_id',
            as:'Schedule'
        }
    }]).exec(function(err,ress){
console.log("hello",ress)
      var a=ress.find(item=>item.Schedule[0]?.student_id==req.params.id)
      //const a=ress.find(item=>item.Schedule.student_id==req.params.id)
      console.log("hello",a)
      if(a==undefined){
        console.log("gekksd")
        a=sub
        msg="submitted"

      }
      else{
        msg="evaluated"
      }
      console.log("hello",a)

      res.json({ 'message':msg, 'data': a })
    }).catch((err)=>{

      })
    }
    catch(err){

    }
  })

module.exports = router;