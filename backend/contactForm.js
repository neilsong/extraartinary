const AWS = require('aws-sdk');
const SES = new AWS.SES();
var RECIEVER = 'song.neil.song@gmail.com';

function validOrigin(testOrigin) {
  const VALID_ORIGINS = ['http://extraartinary.com'];
  return VALID_ORIGINS.filter(origin => origin === testOrigin)[0] || VALID_ORIGINS[0];
}



function sendEmail(formData, callback) {
  const emailParams = {
    Source: RECIEVER,
    ReplyToAddresses: [Email9388859756],
    Destination: {
      ToAddresses: [RECIEVER],
    },
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: `Name: ${formData.FName0110788470} ${formData.LName6278564309}\nPhone Number: ${formData.PNumber0350902328}\nEmail: ${formData.Email9388859756}\n\n${formData.Message4032341236}`,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: formData.subject,
      },
    },
  };

  SES.sendEmail(emailParams, callback);
}

module.exports.submitForm = (event, context, callback) => {
  const origin = event.headers.Origin || event.headers.origin;
  const formData = JSON.parse(event.body);

  // Return with no response if honeypot is present
  if (formData.name)return;
  if (formData.email)return;

  // Return with no response if the origin isn't white-listed
  if (!validOrigin(origin)) return;

  sendEmail(formData, function(err, data) {
    const response = {
      statusCode: err ? 500 : 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': origin,
      },
      body: JSON.stringify({
        message: err ? err.message : data,
      }),
    };

    callback(null, response);
  });
};