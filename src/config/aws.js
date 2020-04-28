import dotenv from "dotenv"
dotenv.config()

const aws = {
  AWS_KEY_ID: process.env.AWS_KEY_ID || '',
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY || '',
  BUCKET_NAME: process.env.BUCKET_NAME || '',
  REGION: process.env.REGION || ''
}

export default aws