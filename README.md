# RentCity Backend

## Pre-requisites
1. Node.JS (https://nodesource.com/blog/installing-node-js-tutorial-using-nvm-on-mac-os-x-and-ubuntu/)
2. MongoDB (https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)
3. Hapi Framework(https://hapi.dev/, https://github.com/hapijs/hapi)

## Libraries In Use
* Eslint[^10.0.1](https://eslint.org/)
* csvtojson(https://www.npmjs.com/package/csvtojson)
* sendgrid(https://www.npmjs.com/org/sendgrid)
* bluebird(https://www.npmjs.com/package/bluebird)
* cryptr(https://www.npmjs.com/package/cryptr)
* Joi- used for validation,comes with hapi but can be used independently(https://www.npmjs.com/package/joi)
* @google/maps(https://www.npmjs.com/package/@google/maps)

## Getting Started
1. Clone this repository by running: `git clone https://github.com/ddevjani/rentcity-web-backend.git`
2. cd into the repository
3. Run `npm install`
4. Run `touch .env`
5. Set the values of following keys in env file
	`NODE_ENV=development
	PORT=3001
	HOST=localhost
	HOST_URL=http://localhost:3001
	MONGODB_URI=mongodb://localhost:27017/rentcity
	SEND_GRID=Send_Grid_Key
	JWT_SECRET=secret
	GOOGLE_API_KEY=`
6. Run `npm start`
7. You're preeeetty much set!

## Project Structure
.src/
├
|── users/
|   ├── handlers/
|   |      └── create-account.js   * Sample handler
|   └── index.js         * REST routes
|
|── Follow same structure for other models apis as users/
|
|── config/
|   └── mongo.js         * Mongodb configuration
|   └── sendgrid.js      * Sendgrid configuration
|   └── auth.js          * Jwt configuration
|   └── index.js         * export all configurations
|   └── server.js        * Default Server Settings
|
|── models/
|   └── users.js         * Mongo collection configuration
|
|── services/            * All external services functions 
|
├── manifest.js          * Server configuration
├── helper.js            * Optional file used for defining some common functions
├── constants.js         * Defined contants 
└── package.json

## Deploying
### Development
If you follow the above, you are golden!
### Staging
1. Merge/rebase your changes into the `staging` branch. 
2. Jenkins will take care of the rest for you :)

### Production
1. Merge/rebase your changes into the `master` branch. 
2. Jenkins will take care of the rest for you :)
