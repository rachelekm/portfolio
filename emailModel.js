'use strict';

require('dotenv').config();
const email = require('emailjs-com');

const templateParams = {
    from_name: 'James',
    to_name: 'Rachele',
    contact_number: 2,
    message: 'Check this out!',
    user_name: 'James',
    user_email: 'james@james.com'
};

const server = email.server.connect({
    user: "emailId_of_gmail_account",
    password: "password_of_gmail_account",
    host: "smtp.gmail.com", 
    ssl: true // in case outlook, use "tls: {ciphers: "SSLv3"}"
});

let emailActions = {
    sendEmail: function(params){
        return new Promise((res, rej) => {
            console.log(params);
            emailjs.send(`${process.env.EMAIL_SERVICEID}`,'contact_form', templateParams)
            .then(response => {
                console.log('SUCCESS!', response.status, response.text);
                res();
            }).catch(err => {
                console.log('FAILED...', err);
                rej(err);
            });
        });
    }
}

module.exports = { emailActions }
