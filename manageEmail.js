'use strict';
const { Transporter } = require('./nodemailerModel');
require('dotenv').config();

let emailActions = {
    sendEmail: function(params){
        return new Promise((res, rej) => {
            let mailOptions = {
                from: `"Web Portfolio Contact" ${process.env.GMAIL_USER}`,
                to: `${process.env.PERSONALEMAIL}`,
                subject: 'You Have A New Email From Web Portfolio Form',
                text: `Hi Rachele!
                It looks like ${params.name} wants to get in touch. Here is the message:
                ${params.message}
                Please reply to their contact email: ${params.email}
                Autmated Web Portfolio Email sent: ${Date.now()}`
            };
      
            Transporter.smtpTransport.sendMail(mailOptions, function(error, info){
                if (error) {
                    rej(error)
                } else {
                    console.log('Email sent: ' + info.response);
                    res();
                }
            }); 
        });
    }
}; 

module.exports = { emailActions }