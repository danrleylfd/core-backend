const nodemailer = require("nodemailer");

const mailConfig = {
  "host": "smtp.gmail.com",
  "port": 465,
  "secure": true,
  "auth": {
    "user": "you@gmail.com",
    "pass": "yourpassword"
  }
}

const transporter = nodemailer.createTransport(mailConfig);
module.exports = transporter;
