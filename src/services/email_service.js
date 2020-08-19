import _ from 'lodash'
import config from '../config'
let mg2 = require('@sendgrid/mail')
mg2.setApiKey(process.env.SEND_GRID)

// const sendGrid = require('sendgrid')(config.get('/sendgrid').apiKey)

// class EmailService {
	export const sendMail=async (email,callback)=>
		{
			console.log('sss')
			var data={
        	from : 'support@noticeframe.com',
        	to : email,
        	subject :'Join Group Link',
        	html: `<!DOCTYPE html><body><h1>Testing purpose</h1></body>	</html>`
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