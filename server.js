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

//Requests
//------------------------------------
// app.post('/login', function(req, res) {
// 	User.findOne({name:req.body.name}, function(err, user) {

// 		if(err)
//         	res.send(err);

//         if(!user) {

//         	var newUser = new User({
// 				name : req.body.name,
// 				password : req.body.password
// 			});

// 			newUser.save(function(err, user) {
// 	            if (err)
// 	            	res.send(err);
	            
// 	            var token = jwt.sign(user, app.get('superSecret'), {
//       				expiresIn: 120 
//     			});
//     			res.cookie('token', token);
//     			res.json({
// 	            	success: true,
// 	            	data: user,
// 	            	token: token
// 	            });
// 	        });
//         } else if (user) {
// 			if (user.password != req.body.password) {
//     			res.json({
//     				success: false,
//     				message: 'Authentication failed. Wrong password.'
//     			});
// 			}
// 			else {
//     			var token = jwt.sign(user, app.get('superSecret'), {
//       				expiresIn: 120 
//     			});
//     			res.cookie('token', token);
//     			res.json({
// 	            	success: true,
// 	            	data: user,
// 	            	token: token
// 	            });
//   			}
// 		}
// 	});
// });

// Sockets
//------------------------------------
var sockets = [];

io.on('connection', function(socket){

	socket.on('send msg', function(data) {
  		io.sockets.emit('get msg', data);
  	});

  	socket.on('set marker', function(data) {
  		var socketData = {
  			location: data.location,
  			username: data.name,
  			id: socket.id
  		};
  		socket.name = data.name;
  		sockets.push(socketData);
  		io.sockets.emit('get marker', sockets);
  		socket.broadcast.emit('user join', socket.name);
  		console.log(socket.name);
  	});

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

//AIzaSyC97Dhgp_x4DSWuzSVYJzBlcTq4vhBrB_g  google maps key