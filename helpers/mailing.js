const nodemailer = require("nodemailer");
require("dotenv").config();

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "tuseeqtoor9@gmail.com",
    pass: "forgoti@G!",
  },
});

module.exports = signupMail = (email) => {
  var mailOptions = {
    from: "tuseeqtoor9@gmail.com",
    to: email,
    subject: "Signup Successful",
    text: "That was easy!",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
module.exports = reportMail = (email, path) => {
  var mailOptions = {
    from: "tuseeqtoor9@gmail.com",
    to: email,
    subject: "Signup Successful",
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

module.exports = resetPasswordMail = (email, token) => {
  var mailOptions = {
    from: "tuseeqtoor9@gmail.com",
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
