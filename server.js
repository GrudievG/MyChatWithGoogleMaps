// Dependencies 
//------------------------------------

var express         = require('express');
var port            = process.env.PORT || 3000;
var jwt             = require('jsonwebtoken');
var bodyParser      = require('body-parser');
var app             = express();
var http            = require('http').Server(app);
var io              = require('socket.io')(http);

// Middleware
//------------------------------------

app.use(express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components')); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Sockets
//------------------------------------

var sockets = [];

io.on('connection', function(socket){

	socket.on('set marker', function(data) {

		var roomName = '' + data.name + ' room';
		var socketData = {
			location: data.location,
			username: data.name,
			id: socket.id
		};
		socket.name = data.name;
		socket.join('general room');
		socket.join(roomName);
		sockets.push(socketData);
		io.to('general room').emit('get marker', sockets);
		socket.broadcast.to('general room').emit('user join', socket.name);

	});

	socket.on('send msg', function(message) {

		if (message.room == "general") {
			io.to('general room').emit('get msg', message);
		}  

		else if(message.room == message.user) {
			io.to('' + message.user + ' room').emit('get private msg', message);
		}

		else {
		io.to('' + message.room + ' room').emit('get private msg', message);
		}
		
	});

	socket.on('broadcasting', function(user) {

		var roomName = '' + user + ' room';
		socket.join(roomName);
		socket.broadcast.to(roomName).emit('user join to private room', socket.name);

	})

	socket.on('disconnect', function () {

		for (var i = 0; i < sockets.length; i++) {

			if (sockets[i].id == this.id) {
				sockets.splice(i, 1);
				socket.broadcast.emit('remove marker', sockets);
			} else continue;

		}

		socket.broadcast.emit('user left', socket.name);

	});

});


// Listening
//------------------------------------

http.listen(port, function(){
  console.log('listening on port: ' + port);
});
