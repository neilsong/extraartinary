const aws = require('aws-sdk')
const ses = new aws.SES()
const myEmail = 'song.neil.song@gmail.com'
const myDomain = 'http://extraartinary.com'
//add 'http://extraartinary.com' to domain when shifting to production

function generateResponse (code, payload) {
  return {
    statusCode: code,
    headers: {
      'Access-Control-Allow-Origin': myDomain,
      'Access-Control-Allow-Headers': 'x-requested-with',
    },
    body: JSON.stringify(payload)
  }
}

function generateError (code, err) {
  console.log(err)
  return {
    statusCode: code,
    headers: {
      'Access-Control-Allow-Origin': myDomain,
      'Access-Control-Allow-Headers': 'x-requested-with',
    },
    body: JSON.stringify(err.message)
  }
}

function generateEmailParams (body) {
  const { fname, lname, email, pnumber, message} = JSON.parse(body);
  console.log(fname, lname, email, pnumber, message)
  if (!(email && fname && lname && message)) {
    throw new Error('Missing parameters! Make sure to add parameters \'email\', \'name\', \'message\'.')
  }

  return {
    Source: myEmail,
    Destination: { ToAddresses: [myEmail] },
    ReplyToAddresses: [email],
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: `Message sent from email ${email} by ${fname} ${lname}.\nPhone Number: ${pnumber}\nMessage: ${message}`
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `New Contact Request`
      }
    }
  }
}

module.exports.send = async (event) => {
  try {
    const emailParams = generateEmailParams(event.body)
    const data = await ses.sendEmail(emailParams).promise()
    return generateResponse(200, data)
  } catch (err) {
    return generateError(500, err)
  }
}