const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1) create transporter (service that send email like gmail)
  const transporter = nodeMailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 2) Define email options (from , to , subject , content)
  const mailOptions = {
    from: "E-shop App <shaymaa@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  //3) send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
