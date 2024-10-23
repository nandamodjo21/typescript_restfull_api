import nodemailer from "nodemailer";
import dotEnv from "dotenv";
dotEnv.config();
// Create a transporter object using the default SMTP transport
export  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_FROM, // Replace with your email
        pass: process.env.EMAIL_PASS // Replace with your email password
    }
});

// Email options
// let mailOptions = {
//     from: process.env.EMAIL_FROM, // Sender address
//     to: process.env.EMAIL_TARGET, // List of recipients
//     subject: 'Node.js Email Test', // Subject line
//     text: 'Hello from JEFF Node.js!', // Plain text body
//     html: '<b>Hello from JEFF Node.js!</b>' // HTML body
// };
//
// // Send email
// transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//         return console.log(`Error: ${error}`);
//     }
//     console.log(`Message Sent: ${info.response}`);
// });