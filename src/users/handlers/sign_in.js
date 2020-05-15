import _ from 'lodash'
import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers'
import Users from '../../models/users'
/** 
Api to Sign in user
**/
var defaults = {}
const handler = async (request, reply) => {
    try {
        let payload = request.payload;
        var userName = payload.userName;
        console.log(userName);
        var password = payload.password;
        var data = await Users.findOne({
           userName
        });
        if (!data) {
            return reply({
                status: 0,
                status_msg: "error",
                message: "Please check your Username!"
            })
        }
        if (data.status == 0) {
            return reply({
                status: 0,
                status_msg: "error",
                message: "Your account has been deactivated. Please contact to admin."
            })
        }
        var is_correct = await Helpers.isPasswordCorrect(data.password, data.salt, password);
        if (is_correct) {
            const token = await Helpers.createJwt(data);
            console.log(token + "token");
            var user_id = data._id;
            var users = await Users.findOneAndUpdate({
                _id: user_id
            }, {
                $set: {
                    token: token
                }
            }, {
                new: true
            });
            if (users) {
                var data = await Users.findOne({
                    _id: user_id
                });
                return reply({
                    status: true,
                    message: 'Login Successfully',
                    data: data
                })
            } else {
                return reply({
                    status: false,
                    message: err
                })
            }
        } else {
            return reply({
                status: false,
                status_msg: "error",
                message: "Your password is incorrect."
            })
        }
    } catch (error) {
        return reply({
            status: false,
            message: error.message,
            // data: {}
        })
    }
}


const routeConfig = {
    method: 'POST',
    path: '/login',
    config: {
        tags: ['api', 'users'],
        description: 'Login FlyFriends Account.',
        notes: ['On success'],
        validate: {
            payload: {
                userName: Joi.string().required(),
                password: Joi.string().required()
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}