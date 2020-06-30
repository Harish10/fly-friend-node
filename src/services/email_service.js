import _ from 'lodash'
import config from '../config'

const sendGrid = require('sendgrid')(config.get('/sendgrid').apiKey)

class EmailService {

}

export default EmailService