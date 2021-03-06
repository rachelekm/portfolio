'use strict';

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const { emailActions } = require('./manageEmail');
const { Transporter } = require('./nodemailerModel');

Transporter.createTransportObject();

process.on('SIGTERM', function (err) {
    Transporter.smtpTransport.close();
    if(err){ console.log(err) }; 
    process.exit(err ? 1 : 0);
});

process.on('uncaughtException', function (err) {
    Transporter.smtpTransport.close();  
    if(err){ console.log(err) };
    process.exit(1)
});

const app = express();
app.use(morgan('common'));
app.use(express.static('public'));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST');
  next();
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/email', jsonParser, (req, res) => {
    emailActions.sendEmail(req.body).then(() => {
        return res.status(200).send(JSON.stringify('OK'));
    }).catch(e => {
        return res.status(500).send(JSON.stringify('Error sending email: ' + e));
    });
});

let server;

function runServer() {
  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      console.log(`Your app is listening on port ${port}`);
      resolve(server);
    })
    .on('error', err => {
      reject(err);
    });
  });
}

function closeServer() {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = { app, runServer, closeServer }