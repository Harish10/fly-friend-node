import Hoek from 'hoek'
import Joi from 'joi'
import Users from '../../models/users'
import _ from 'lodash'

/*
 * Api to fetch all users
 **/
let defaults = {};

const handler = async (request, reply) => {
  try {
    let skip = 0;
    const text = request.query.q ? request.query.q : ""
    const usertype = request.query.type ? request.query.type : "user"
    const page = parseInt(request.query.page)
    const limit = request.query.limit
    page > 1 ? (skip = (page - 1) * limit) : page
    const query = [{
        $match: {
          $or: [{
              firstname: {
                $regex: text,
                $options: 'i'
              }
            },
            {
              lastname: {
                $regex: text,
                $options: 'i'
              }
            },
            {
              email: {
                $regex: text,
                $options: 'i'
              }
            }
          ],
          usertype: usertype
        }
      },
      {
        $sort: {
          createdAt: -1
        }
      },
      {
        $facet: {
          data: [{
              $skip: skip
            },
            {
              $limit: parseInt(limit)
            }
          ],
          count: [{
            $count: "count"
          }]
        }
      }, {
        $project: {
          data: 1,
          count: {
            $ifNull: [{
              $arrayElemAt: ["$count.count", 0]
            }, 0]
          }
        }
      }

    ]
    const users = await Users.aggregate(query)
    return reply({
      status: true,
      message: 'Users list.',
      data: _.get(users[0], 'data', []),
      count: _.get(users[0], 'count', 0)
    });
  } catch (error) {
    return reply({
      status: false,
      message: error.message,
      data: []
    });
  }
};

const queryshcema = Joi.object({
  page: Joi.number().required(),
  limit: Joi.number().required(),
  q: Joi.any().optional(),
  type: Joi.any().required()
});

const routeConfig = {
  method: 'GET',
  path: '/users',
  config: {
    tags: ['api', 'users'],
    description: 'To get all user for show admin side.',
    notes: ['On success, returns { "data": [ { "users" } ]}'],
    validate: {
      query: queryshcema
    },
    handler
  }
};

export default (server, opts) => {
  defaults = Hoek.applyToDefaults(defaults, opts);
  server.route(routeConfig);
};