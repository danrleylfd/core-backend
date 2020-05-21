const nodemailer = require("nodemailer");
const mailConfig = require('../config/mail.json');
const transporter = nodemailer.createTransport(mailConfig);
module.exports = transporter;
