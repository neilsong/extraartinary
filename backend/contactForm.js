var AWS = require('aws-sdk');
var ses = new AWS.SES();

var SENDER = 'song.neil.song@gmail.com';


exports.handler = function (event, context, callback) {
    console.log('Received event:', event);
    sendEmail(event, function (err, data) {
        var response = {
        "isBase64Encoded": false,
        "headers": { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'extraartinary.com'},
         "statusCode": 200,
        "body": "{\"result\": \"Success.\"}"
         };

        return response
    });
   
};
 
function sendEmail (event, done) {
    var params = {
        Destination: {
            ToAddresses: [event.Email]
        },
        Message: {
            Body: {
                Text: {
                    Data: 'firstname: ' + event.FName + ' lastname: ' + event.LName + '\nphone: ' + event.PNumber + '\nemail: ' + event.Email + '\ndesc: ' + event.Message,
                    Charset: 'UTF-8'
                }
            },
            Subject: {
                Data: 'Website Referral Form: ' + event.Fname + ' ' + event.LName,
                Charset: 'UTF-8'
            }
        },
        Source: SENDER
    };
    ses.sendEmail(params, done);
}