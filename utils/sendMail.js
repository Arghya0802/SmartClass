import nodemailer from "nodemailer";

export const sendMail = (email, otp) => {
  return new Promise((resolve, reject) => {
    const transport = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const sender = "Eduhub Team";
    const mailOptions = {
      from: sender,
      to: email,
      subject: "Eduhub Email Verification",
      html: `<p>Your otp is: <b>${otp}</b>. Use this to verify your account.</p>`,
    };

    transport.sendMail(mailOptions, (err, res) => {
      if (err) {
        console.log(err);
        reject(false);
      } else {
        console.log(res);
        resolve(true);
      }
    });
  });
};
