/*
 * Rentcity Loggin Config file functions
 **/
const logging = {}

logging.ops = {
  interval: 1000
}

logging.reporters = {}
logging.reporters.console = [{
    module: 'good-squeeze',
    name: 'Squeeze',
    args: [{
      log: '*',
      response: '*'
    }]
  },
  {
    module: 'good-console'
  },
  'stdout'
]

logging.reporters.file = [{
    module: 'good-squeeze',
    name: 'Squeeze',
    args: [{
      log: '*',
      response: '*'
    }]
  },
  {
    module: 'good-squeeze',
    name: 'SafeJson'
  }
]

export default logging