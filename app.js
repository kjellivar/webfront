var express = require('express'),
    app = express(),
    routes = require('./routes'),
    path = require('path'),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    mongoose = require('mongoose'),
    users = {};

    server.listen(3000);

mongoose.connect('mongodb://localhost:27017/chat', function(err){
    if(err){
        console.log(err);
    } else{
        console.log('Connected to mongodb!');
    }
});

var chatSchema = mongoose.Schema({
    nick: String,
    msg: String,
    created: {type: Date, default: Date.now}
});

var Chat = mongoose.model('Message', chatSchema);

// all environments
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  console.log("in development");
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/chat', routes.chat);
//app.get('/userlist', routes.userlist(db));
//app.post('/userlist', routes.adduser(db));

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