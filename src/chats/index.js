import chatHandler from './handlers/chatHandler'
import socketcheck from './handlers/socketcheck'


exports.register=(server,options,next)=>{
// console.log(server);

 var io =require('socket.io')(server.listener);
    io.on('connection', function (socket) {
   	console.log('connected')
    });
    chatHandler(server,options,io);
    socketcheck(server,options,io);
	next();
}

exports.register.attributes={
	name:"chat"
}
