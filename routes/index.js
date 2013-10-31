
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.helloworld = function(req, res){
    res.render('helloworld', { title: 'Your mama' });
};

exports.newuser = function(req, res){
    res.render('newuser', { title: 'Add new user' });
};

exports.userlist = function(db) {
    return function(req, res) {
        var collection = db.get('hei');
        collection.find({},{},function(e,docs){
            res.render('userlist', {
                "names" : docs
            });
        });
    };
};

exports.adduser = function(db) {
    return function(req, res) {

        // Get our form values. These rely on the "name" attributes
        var userName = req.body.username;

        // Set our collection
        var collection = db.get('hei');

        // Submit to the DB
        collection.insert({
            "name" : userName
        }, function (err, doc) {
            if (err) {
                // If it failed, return error
                res.send("There was a problem adding the information to the database.");
            }
            else {
                // If it worked, forward to success page
                res.redirect("userlist");
                // And set the header so the address bar doesn't still say /adduser
                res.location("userlist");
            }
        });

    }
}