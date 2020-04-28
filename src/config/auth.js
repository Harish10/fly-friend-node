/*
 * Rentcity auto token settings
 **/
const auth = {}
auth.key = {
  $filter: 'env',
  'development': 'development-key',
  'sandbox': '',
  'production': process.env.JWT_SECRET,
  'test': 'test-key',
  $default: '20rentcitytoken18'
}

auth.expires = {
  $filter: 'env',
  'development': '5000d',
  'sandbox': '5000d',
  'production': '5000d',
  'test': '5000d',
  $default: '5000d'
}

auth.verifyOptions = {
  algorithms: ['HS256']
}

export default auth