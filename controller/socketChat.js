// Denne lå i app.js
io.sockets.on('connection', function(socket){
	var query = Chat.find({});
	query.sort('-created').limit(8).exec(function(err, docs){
		if(err) throw err;
		socket.emit('load old msgs', docs);
	});

	socket.on('new user', function(data, callback){
		if (data in users){
			callback(false);
		} else{
			callback(true);
			socket.nickname = data;
			users[socket.nickname] = socket;
			updateNicknames();
		}
	});

	function updateNicknames(){
		io.sockets.emit('usernames', Object.keys(users));
	}

	socket.on('send message', function(data){
		var msg = data.trim();
		console.log('after trimming message is: ' + msg);
		var newMsg = new Chat({msg: msg, nick: socket.nickname});
		newMsg.save(function(err){
			if(err) throw err;
			io.sockets.emit('new message', {msg: msg, nick: socket.nickname});
		});
	});

	socket.on('disconnect', function(data){
		if(!socket.nickname) return;
		delete users[socket.nickname];
		updateNicknames();
	});
});