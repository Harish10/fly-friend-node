import Emitter from '../config/emitter'
exports.register = function (server, options, next) {
  var io = require('socket.io')(server.listener);
	io.on('connection', function (socket) {
		// Subscribe this socket to `action` events
		Emitter.on('fetch-chat', function (action) {
			console.log(action, 'action')
				// socket.emit('action', action);
		});
	});
  next();
};

exports.register.attributes = {
  name: 'socket'
};
 
