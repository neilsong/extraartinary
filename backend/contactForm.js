var AWS = require('aws-sdk');
var ses = new AWS.SES();

var SENDER = 'song.neil.song@gmail.com';

function sendEmail(formData, callback) {
    const emailParams = {
      Source: SENDER,
      ReplyToAddresses: [SENDER],
      Destination: {
        ToAddresses: [formData.Email], // SES RECEIVING EMAIL
      },
      Message: {
        Body: {
          Text: {
            Charset: 'UTF-8',
            Data: 'firstname: ' + formData.FName + ' lastname: ' + formData.LName + '\nphone: ' + formData.PNumber + '\nemail: ' + formData.Email + '\ndesc: ' + formData.Message,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'Website Referral Form: ' + formData.Fname + ' ' + formData.LName,
        },
      },
    };
  
    SES.sendEmail(emailParams, callback);
  }

exports.handler = function (event, context, callback) {
    const formData = event.body;

    sendEmail(formData, function(err, data) {
    const response = {
      statusCode: err ? 500 : 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://extraartinary.com',
      },
      body: JSON.stringify({
        message: err ? err.message : data,
      }),
    };

    callback(null, response);
  });
};
