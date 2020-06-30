import config from '../config'

const googleMapsClient = require('@google/maps').createClient({
  key: config.get('/google').apiKey
})

class GoogleService {
  addressInfo(address) {
    return new Promise((resolve, reject) => {
      googleMapsClient.geocode({
        address: address
      }, (err, response) => {
        if (err) {
          return reject(err)
        } else {
          return resolve(response.json.results)
        }
      })
    })
  }
}

export default new GoogleService