const nodemailer = require('nodemailer')

const sendEamil = async options => {
  const transporter = nodemailer.createTransport({
    service: 'qq',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  })

  const info = await transporter.sendMail({
    from: `${process.env.SMTP_NAME} <${process.env.SMTP_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  })

  console.log(`Message sent: ${info.messageId}`)
}

exports.sendEamil = sendEamil
