var express = require('express'),
    app = express(),
    path = require('path'),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
	db = require('./config/dbschema'),
	pass = require('./config/pass'),
	passport = require('passport'),
	basic_routes = require('./routes/basic'),
	user_routes = require('./routes/user');

// all environments
app.configure(function() {
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
});

// development only
if ('development' == app.get('env')) {
  console.log("You're in development");
  app.use(express.errorHandler());
}

//app.get('/', routes.index);
//app.get('/chat', routes.chat);
//app.get('/userlist', routes.userlist(db));
//app.post('/userlist', routes.adduser(db));

// Basic pages
app.get('/', basic_routes.index);
app.get('/meetingroom', basic_routes.meetingRoom);

// User pages
app.get('/account', pass.ensureAuthenticated, user_routes.account);
app.get('/login', user_routes.getlogin);
app.post('/login', user_routes.postlogin);
app.get('/admin', pass.ensureAuthenticated, pass.ensureAdmin(), user_routes.admin);
app.get('/logout', user_routes.logout);

server.listen(3000, function() {
	console.log('Express server listening on port 3000');
});