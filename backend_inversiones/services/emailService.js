const nodemailer = require('nodemailer')

let transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

const sendEmail = (email, user) => {
    const mailOptions = {
        to: email,
        subject: "Account created",
        html: `<h1>Hello ${user.name}!</h1>
        <p>Thank you for registering on our page.</p>
        <h3>Credentials:</h3>
        <h4>Username: ${user.username}</h4><h4>Password: ${user.password}</h4>`
    };
    transport.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = { sendEmail };