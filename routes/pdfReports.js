//Required package
var pdf = require("pdf-creator-node");
var fs = require("fs");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const mongoose = require("mongoose");
const path = require("path");
// Read HTML Template
const reportMail = require("../helpers/mailing");
router.post("/generate-synopsis-report", (req, res, next) => {
  console.log(req.body);
  var html = fs.readFileSync(
    path.join(__dirname, "../pdfTemplates/synopsisReport.html"),
    "utf8"
  );
  const bitmap = fs.readFileSync(
    path.join(__dirname, "../pdfTemplates/cui.png")
  );
  const logo = bitmap.toString("base64");

  var options = {
    format: "A4",
    orientation: "portrait",
    border: "10mm",
  };
  const goEval = req.body.evaluations.map((eval) => eval.goEvaluation);
  var document = {
    html: html,
    data: {
      logo: logo,
      evaluations: req.body.evaluations,
      synopsis: req.body.synopsis,
      goEvaluation: goEval[0],
    },
    path: `../Server/public/pdfReports/${req.body.synopsis[0].student_id.registrationNo}_Synopsis.pdf`,
  };

  pdf
    .create(document, options)
    .then((response) => {
      console.log(response);
      res.status(200).json({ message: "Generated" });
    })
    .catch((error) => {
      console.error(error);
    });
});

router.get("/generate-synopsis-report/:registrationNo", (req, res) => {
  console.log("registraitionNO", req.params.registrationNo);

  const file = path.join(
    __dirname,
    `../public/pdfReports/${req.params.registrationNo}_Synopsis.pdf`
  );
  res.download(file);
});

router.post(
  "/generate-and-send-synopsis/:supervisoremail/:studentemail",
  (req, res, next) => {
    console.log(req.body);
    var html = fs.readFileSync(
      path.join(__dirname, "../pdfTemplates/synopsisReport.html"),
      "utf8"
    );
    const bitmap = fs.readFileSync(
      path.join(__dirname, "../pdfTemplates/cui.png")
    );
    const logo = bitmap.toString("base64");

    var options = {
      format: "A4",
      orientation: "portrait",
      border: "10mm",
    };
    const goEval = req.body.evaluations.map((eval) => eval.goEvaluation);
    var document = {
      html: html,
      data: {
        logo: logo,
        evaluations: req.body.evaluations,
        synopsis: req.body.synopsis,
        goEvaluation: goEval[0],
      },
      path: `../Server/public/pdfReports/${req.body.synopsis[0].student_id.registrationNo}_Synopsis.pdf`,
    };

    pdf
      .create(document, options)
      .then((response) => {
        console.log(response);
        reportMail(
          req.params.supervisoremail,
          path.join(
            __dirname,
            `../public/pdfReports/${req.params.registrationNo}_Synopsis.pdf`
          )
        );
        reportMail(
          req.params.studentemail,
          path.join(
            __dirname,
            `../public/pdfReports/${req.params.registrationNo}_Synopsis.pdf`
          )
        );
        res.status(200).json({ message: "Generated" });
      })
      .catch((error) => {
        console.error(error);
      });
  }
);

/////////////Thesis Report/////////////

router.post("/generate-thesis-report", (req, res, next) => {
  console.log(req.body);
  var html = fs.readFileSync(
    path.join(__dirname, "../pdfTemplates/thesisReport.html"),
    "utf8"
  );
  const bitmap = fs.readFileSync(
    path.join(__dirname, "../pdfTemplates/cui.png")
  );
  const logo = bitmap.toString("base64");

  var options = {
    format: "A4",
    orientation: "portrait",
    border: "10mm",
  };
  const goEval = req.body.evaluations.map((eval) => eval.goEvaluation);

  var document = {
    html: html,
    data: {
      logo: logo,
      evaluations: req.body.evaluations,
      thesis: req.body.thesis,
      goEvaluation: goEval[0],
    },
    path: `../Server/public/pdfReports/${req.body.thesis[0].student_id.registrationNo}_Thesis.pdf`,
  };

  pdf
    .create(document, options)
    .then((response) => {
      console.log(response);
      res.status(200).json({ message: "Thesis Report Generated" });
    })
    .catch((error) => {
      console.error(error);
    });
});

router.get("/generate-thesis-report/:registrationNo", (req, res) => {
  console.log("registraitionNO", req.params.registrationNo);

  const file = path.join(
    __dirname,
    `../public/pdfReports/${req.params.registrationNo}_Thesis.pdf`
  );
  res.download(file);
});

router.post(
  "/generate-and-send-thesis/:supervisoremail/:studentemail",
  (req, res, next) => {
    console.log(req.body);
    var html = fs.readFileSync(
      path.join(__dirname, "../pdfTemplates/thesisReport.html"),
      "utf8"
    );
    const bitmap = fs.readFileSync(
      path.join(__dirname, "../pdfTemplates/cui.png")
    );
    const logo = bitmap.toString("base64");

    var options = {
      format: "A4",
      orientation: "portrait",
      border: "10mm",
    };
    const goEval = req.body.evaluations.map((eval) => eval.goEvaluation);

    var document = {
      html: html,
      data: {
        logo: logo,
        evaluations: req.body.evaluations,
        thesis: req.body.thesis,
        goEvaluation: goEval[0],
      },
      path: `../Server/public/pdfReports/${req.body.thesis[0].student_id.registrationNo}_Thesis.pdf`,
    };

    pdf
      .create(document, options)
      .then((response) => {
        console.log(response);
        reportMail(
          req.params.supervisoremail,
          path.join(
            __dirname,
            `../public/pdfReports/${req.params.registrationNo}_Thesis.pdf`
          )
        );
        reportMail(
          req.params.studentemail,
          path.join(
            __dirname,
            `../public/pdfReports/${req.params.registrationNo}_Thesis.pdf`
          )
        );
        res.status(200).json({ message: "Thesis Report Generated" });
      })
      .catch((error) => {
        console.error(error);
      });
  }
);

module.exports = router;
