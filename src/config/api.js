import pkg from '../../package.json'

/*
 * Fly Friends Api Title, Description, version settings in this file
 **/
const api = {
  auth: false,
  info: {
    title: 'Fly Friends',
    description: 'City Service Management',
    version: pkg.version
  },
  jsonEditor: true,
  securityDefinitions: {
    jwt: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header'
    }
  },
  security: [{
    'jwt': []
  }]
}

export default api