const nodemailer = require("nodemailer");
require("dotenv").config();

var transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: "sabahatsyed2000@gmail.com",
    pass: "suikdcobytlajaio",
  },tls: {
    rejectUnauthorized: false
  }
});

module.exports.signupMail = (email,password) => {
  var mailOptions = {
    from: "sabahatsyed2000@gmail.com",
    to: email,
    subject: "Signup Successful",
    text: "your account password is "+password,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("sdada",error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
module.exports.reportMail = (email, path) => {
  var mailOptions = {
    from: "sabahatsyed2000@gmail.com",
    to: email,
    subject: "Report Email",
    attachment: path,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports.declineMail = (email) => {
  var mailOptions = {
    from: "sabahatsyed2000@gmail.com",
    to: email,
    subject: "Declined Rebuttle Email",
    text:"Your Rebuttle has been Declined by the Supervisor. Contact Office for further details",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};


module.exports.resetPasswordMail = (email, token) => {
  var mailOptions = {
    from: "sabahatsyed2000@gmail.com",
    to: email,
    subject: "Reset Password",
    html: `<p>You requested for reset password, kindly use this <a href="${process.env.REACT_APP_URL}/ResetPassword/${token}">link</a> to reset your password</p>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
