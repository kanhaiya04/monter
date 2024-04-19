const nodemailer = require("nodemailer");

const mailSender = async (email: string, title: string, body: string) => {
  try {
    // Create a Transporter to send emails
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
    // Send emails to user
    let info = await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: title,
      html: body,
    });
    console.log("Email info: ", info);
    return info;
  } catch (error: any) {
    console.log(error.message);
  }
};

export default mailSender;
