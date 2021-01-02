'use strict';

require('dotenv').config();
const emailjs = require('emailjs');

emailjs.init(`${process.env.EMAIL_USERID}`);

const templateParams = {
    name: 'James',
    notes: 'Check this out!'
};

let emailActions = {
    sendEmail: function(){
        return new Promise((res, rej) => {
            emailjs.send(`${process.env.EMAIL_SERVICEID}`,'contact_form', templateParams)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                res();
            }, function(err) {
                console.log('FAILED...', err);
                rej();
            });
        });
    }
}

module.exports = { emailActions }
