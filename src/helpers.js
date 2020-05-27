/* eslint-disable complexity */
import _ from 'lodash'
import Boom from 'boom'
import Jwt from 'jsonwebtoken'
import Hoek from 'hoek'
import crypto from 'crypto';
import constants from './constants'
import Config from './config'
// import GoogleService from './services/google_service'
// import slugify from 'slugify'
// import isBase64 from 'is-base64'
// import Mongoose from 'mongoose'
// import axios from 'axios'
import AwsServices from './services/aws_service'
// const awsServices = new AwsServices()
// const storeFile = require('request').defaults({
//   encoding: null
// })

/*eslint-disable no-magic-numbers */
/*eslint camelcase: [2, {properties: "never"}]*/
/*eslint no-nested-ternary: 0*/

const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

const extractUserId = (request) => {
    return _.get(request, 'auth.credentials.id', false)
}

export const createJwt = (user) => {

    const contents = {
        id: user._id,
        createdAt: Date.now()
    }

    const options = Hoek.applyToDefaults({
        key: null,
        // expires: '3min',
        verifyOptions: {
            algorithms: ['HS256']
        }
    }, Config.get('/auth'))

    const token = Jwt.sign(
        contents,
        options.key, {
            algorithm: options.verifyOptions.algorithms[0],
            expiresIn: options.expires
        }
    )

    return token
}


export const boomify = (err) => {
    const statusCode = Number(_.get(err, 'statusCode', _.get(err, 'raw.statusCode', constants.HTTP400)))
    const strErr = `${err}`
    const message = _.get(err, 'message', _.get(err, 'raw.message', _.get(err, 'error_message', strErr === '' ? 'Bad Request' : strErr)))

    let boom = null
    if (_.get(err, 'isBoom', false)) {
        boom = err
    } else if (!_.isError(err)) {
        boom = Boom.create(statusCode, message, {
            timestamp: Date.now()
        })
    } else if (_.isError(err)) {
        boom = Boom.wrap(err, statusCode, message)
    } else { // err.isBoom
        boom = err
    }
    if (!_.get(boom, 'response', false)) {
        console.error('error', boom) // eslint-disable-line no-console
    } else {
        console.error('error', _.get(boom, 'output', '')) // eslint-disable-line no-console
    }
    return boom
}

export const generatePassword = (length = 8) => {
    var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

var genRandomString = (length) => {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0, length); /** return required number of characters */
};

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
var sha512 = function(password, salt) {
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt: salt,
        passwordHash: value
    };
};

export const generateSalt = (length = 255) => {
    return genRandomString(length); /** Gives us salt of length 16 */
}

export const hashPassword = (userpassword) => {
    return bcrypt.hashSync(userpassword, salt);
    // var salt = genRandomString(255); /** Gives us salt of length 16 */
    // var passwordData = sha512(userpassword, salt);
    // return {
    //     salt: passwordData.salt,
    //     hash: passwordData.passwordHash
    // };
}

export const matchPassword = (password, hasPassword) => {
    return bcrypt.compareSync(password, hasPassword);
}

export const isPasswordCorrect = (savedPass, salt, userpassword) => {
    var passwordData = sha512(userpassword, salt);
    return savedPass == passwordData.passwordHash;
}

export const sessionrefresh = (req) => {
    var hh = 3600 * 10000000;
    req.session.cookie.expires = new Date(Date.now() + hh);
}




export default {
    boomify,
    createJwt,
    extractUserId,
    generatePassword,
    sessionrefresh,
    isPasswordCorrect,
    hashPassword,
    matchPassword
}