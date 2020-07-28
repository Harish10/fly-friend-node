import Hoek from 'hoek'
import Joi from 'joi'
import _ from 'lodash'
import fileType from 'file-type'
import AWS from 'aws-sdk'
// import aws_config from '../../config'

AWS.config.update({
  accessKeyId:  process.env.AWS_KEY_ID,
  secretAccessKey:  process.env.AWS_SECRET_KEY
})

AWS.config.setPromisesDependency(Promise)

const s3 = new AWS.S3()

/*
 * Api to upload images
 **/
let defaults = {}

const handler = async (request, reply) => {
  let requestData = request.payload
  try {
    
    if ( requestData['image'] != "null" ){
      const type = fileType(requestData['image'])
      const timestamp = Date.now().toString()
      const file_name = `images/${timestamp}`
      if ( type.ext == "png" || type.ext == "jpg" || type.ext == "jpeg" ){
        const params = {
          ACL: 'public-read',
          Body: requestData['image'],
          Bucket: process.env.BUCKET_NAME,
          ContentType: type.mime,
          timestamp : Date.now().toString(),
          Key: file_name + "." + type.ext
        }
        s3.upload(params, function(err, data){
          const response_data = { status: true, message: "File uploaded succecssfully", image_url: data.Location }
          reply(response_data)               
        })
  
      } else {
        const response_data = { status: false, message: "Invalid image type" }
        reply(response_data)                
      }
    } else {
      const response_data = { status: false, message: "Invalid image type" }
      reply(response_data)                    
    }
  } catch (error) {
    return reply({ status: false, message: error.message, data: {} })
  }
}

const routeConfig = {
  method: 'POST',
  path: '/users/upload_file',
  config: {
    // auth: 'jwt',
    tags: ['api', 'upload_image'],
    description: 'Upload images',
    notes: ['On success, returns { "data": [ { "users" } ]}'],
    handler
  }
}

export default (server, opts) => {
  defaults = Hoek.applyToDefaults(defaults, opts)
  server.route(routeConfig)
}