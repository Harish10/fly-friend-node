import _ from 'lodash'
import config from '../config'
let mg2 = require('@sendgrid/mail')
mg2.setApiKey(process.env.SEND_GRID)

// const sendGrid = require('sendgrid')(config.get('/sendgrid').apiKey)

// class EmailService {
	export const sendMail=async (body,callback)=>
		{
			// console.log('sss')
			var data={
        	from : 'support@noticeframe.com',
        	to : body.email,
        	subject :'Update Password Link.',
        	html: `<!DOCTYPE html>
            <html lang="en">
            <head>
              <title>Notice Frame Forget Password</title>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <link href="https://fonts.googleapis.com/css?family=Poppins&display=swap" rel="stylesheet">
              <style>
                body { font-family: "Poppins", sans-serif; margin: 0; font-size: 14px; background: #f1f1f1; }
              </style>
            </head>
            <body style="background: #f1f1f1;">
              <div style="width: 700px; max-width: 100%; margin: 0 auto; background: #3b5261; box-shadow: 0 0 15px #ccc;">
                <div style="text-align: center; padding-top: 30px; padding-bottom: 25px;">
                  <div style="text-align: left; border-radius: 20px; margin: 50px auto 20px; width: 80%;">
                    <span style="width: 100%; text-align: left; display: inline-block; margin-bottom: 50px;">
                      <a href="" target="_blank"><img src="{logo}" caption="false" width="60px"></a>
                    </span>
                    <p style="font-size: 16px; color: #fff;font-family: 'Poppins', sans-serif; margin: 0 0 15px 0; font-weight: 500; line-height: 24px;">
                      Hello,</p>
                    <p style="font-size: 16px; color: #fff;font-family: 'Poppins', sans-serif; margin: 0 0 15px 0; font-weight: 500; line-height: 24px;">
                      You have requested to change the password.</p>
                    <p style="font-size: 16px; color: #fff;font-family: 'Poppins', sans-serif; margin: 0 0 20px 0; font-weight: 500; line-height: 24px;">
                      To do so please click the button below and follow the process.</p>
                    <a href=${body.link}><button
                      style="font-weight: 900; letter-spacing: 0.5px; margin: 20px 0; border: 0; border-radius: 30px; background: #ff6600; color: #fff; width: 200px; padding: 10px; font-family: Poppins; cursor: pointer; font-size: 18px;">Reset
                      Password</button></a>
                  </div>
                  <div style="text-align: left; border-radius: 20px; margin: 0 auto 0; width: 80%;">
                    <p style="font-size: 15px;  color: #fff;font-family: 'Poppins', sans-serif; margin: 0 0 20px 0; font-weight: 500; line-height: 24px;">
                      Thank you!</p>
                    </div>
                  </div>
            </body>
            </html>`
    	}
await mg2.send(data)
    .then(m => {
      console.log('Mail sent')
        callback(true)
    })
    .catch(error => {
      console.error(error.toString())
     callback(false)
    })
	}
	   //  return new Promise(async(resolve, reject) =>  {
    //   const request = sendGrid.emptyRequest({
    //     method: 'POST',
    //     path: '/v3/mail/send',
    //     body: {
    //       personalizations: [{
    //         to: [{
    //           email: email
    //         }],
    //         dynamic_template_data:"hello testing" ,
    //       }],
    //       from: {
    //         identity: `RentCity`,
    //         name: `RentCity`,
    //         email: config.get('/sendgrid').senderEmail
    //       },
    //       template_id: "222"
    //     }
    //   })

    //  await sendGrid.API(request, (error, response) => {
    //     if (error) {
    //     	console.log(error);
    //       return reject(error)
    //     } else {
    //     	console.log(response);
    //       return resolve(response)
    //     }
    //   })
    // })
// }
// }

export default {sendMail};