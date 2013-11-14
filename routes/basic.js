exports.index = function(req, res) {
	res.render('index', { user: req.user });
};

exports.meetingRoom = function(req, res) {
	res.render('meetingroom', { user: req.user });
};