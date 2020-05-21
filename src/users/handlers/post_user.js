import _ from 'lodash'
import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers'
import Users from '../../models/users'

/** 
Api to create new user
**/

var defaults = {};
const handler = async (request, reply) => {
    const email = _.get(request, 'payload.email', '')
    try {
        let payload = request.payload
        const user = await Users.findOne({
            email
        })
        if (!user) {
            const user_name = _.get(request, "payload.userName", payload.firstName);
            const userName = await Users.findOne({
                userName:user_name
            })
            if (!userName) {
                console.log('enter');
                let payload = request.payload;
                const user_name = _.get(request, "payload.userName", payload.firstName);
                payload.userName=user_name;
                var password = payload.password;
                var saltPass = Helpers.hashPassword(password);
                payload.salt = saltPass.salt;
                payload.password = saltPass.hash;
                const newUser = await new Users(payload)
                const argument= await newUser.save();
                    if (argument) {
                        const token = await Helpers.createJwt(newUser);
                        var user_id = newUser._id;
                        await Users.findOneAndUpdate({
                            _id: user_id
                        }, {
                            $set: {
                                token: token
                            }
                        },{
                            new: true
                        });
                        return reply({
                            status: true,
                            message: 'User Created Successfully',
                            data: token
                        })
                    }
            } else {
                return reply({
                    status: false,
                    message: "User_name already exists."
                })
            }
        } else {
            return reply({
                status: false,
                message: 'Email already exists.',
            })
        }
    } catch (error) {
        return reply({
            status: false,
            message: error.message
        })
    }
}

const routeConfig = {
    method: 'POST',
    path: '/register',
    config: {
        tags: ['api', 'users'],
        description: 'Create FlyFriends Account.',
        notes: ['On success'],
        validate: {
            payload: {
                userName: Joi.string().optional(),
                firstName: Joi.string().required(),
                lastName: Joi.string().required(),
                email: Joi.string().required(),
                password: Joi.string().required(),
                countryCode: Joi.string().required(),
                mobileNo: Joi.string().required(),
                dob: Joi.string().optional(),
                address: Joi.string().optional(),
                lat: Joi.string().optional(),
                long: Joi.string().optional(),
                userImage: Joi.string().optional(),
                city: Joi.string().optional(),
                state: Joi.string().optional(),
                token: Joi.string().optional(),
                country: Joi.string().optional()
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}