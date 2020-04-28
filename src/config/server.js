export default {
  port: process.env.PORT,
  host: '0.0.0.0',
  routes: {
    'cors': true,
    payload: {
      maxBytes: 100000000 //100mb
    }
  }
}