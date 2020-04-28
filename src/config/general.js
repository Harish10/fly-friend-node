/*
 * Rentcity General Default setting
 **/
export default {
  portal: process.env.NODE_ENV === '' ? '' : '',
  tld: {
    $filter: 'env',
    development: '',
    sandbox: '',
    production: '',
    $default: 'http://localhost:8080'
  }
}