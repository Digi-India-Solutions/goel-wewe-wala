const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "goelmewewale@gmail.com", // Replace with your email
    pass: "ykok dcfj vmoj mhbg", // Replace with App Password
  }, // Output detailed logs
});

module.exports = { transporter };
