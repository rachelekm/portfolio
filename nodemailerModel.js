'use strict';

const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

require('dotenv').config();

const oauth2Client = new OAuth2(
    `${process.env.GOOGLE_CLIENTID}`, // ClientID
    `${process.env.GOOGLE_SECRET}`, // Client Secret
    "https://developers.google.com/oauthplayground" // Redirect URL
);

let Transporter = {
    createTransportObject: function(){
        oauth2Client.setCredentials({
            refresh_token: process.env.G_REFRESHTOKEN
        });
        
        const accessToken = oauth2Client.getAccessToken();
        Transporter.smtpTransport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                 type: "OAuth2",
                 user: process.env.GMAIL_USER, 
                 clientId: process.env.GOOGLE_CLIENTID,
                 clientSecret: process.env.GOOGLE_SECRET,
                 refreshToken: process.env.G_REFRESHTOKEN,
                 accessToken: accessToken
            }
        });  
    },
    smtpTransport: {}
};

module.exports = { Transporter }