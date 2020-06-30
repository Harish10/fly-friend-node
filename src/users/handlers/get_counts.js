import Hoek from 'hoek'
import _ from 'lodash'
import Helpers from '../../helpers'
import Users from '../../models/users'
import Brokers from '../../models/brokers'
import Buildings from '../../models/buildings'
import Reviews from '../../models/reviews'

let defaults = {}
/*
 * Here is the api for get login user record based on jwt token
 **/
const handler = async (request, reply) => {
  try {
    const userId = await Helpers.extractUserId(request)
    const user = await Users.findOne({
      _id: userId
    })
    if (_.get(user, 'usertype', 'admin') !== 'admin') {
      return reply({
        status: true,
        message: 'Count fetched successfully',
        review: await Reviews.count({
          userId,
          isdraft: false
        }),
        draft: await Reviews.count({
          userId,
          isdraft: true
        }),
        building: _.get(user, 'buildings', []).length
      })
    } else {
      return reply({
        status: true,
        message: 'Count fetched successfully',
        user: await Users.count({
          usertype: 'user'
        }),
        manager: await Users.count({
          usertype: 'propertyManager'
        }),
        broker: await Brokers.count({}),
        review: await Reviews.count({
          userId,
          isdraft: false
        }),
        building: await Buildings.count({
          slug_url: {
            $ne: ''
          }
        }),
        draft: await Reviews.count({
          userId,
          isdraft: true
        })
      })
    }
  } catch (error) {
    return reply({
      status: false,
      message: error.message,
      data: {}
    })
  }
}

const routeConfig = {
  method: 'GET',
  path: '/counts',
  config: {
    auth: 'jwt',
    tags: ['api', 'counts'],
    description: 'Get profile counts.',
    notes: [],
    handler
  }
}

export default (server, opts) => {
  defaults = Hoek.applyToDefaults(defaults, opts)
  server.route(routeConfig)
}