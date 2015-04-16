var express = require('express');

var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/practice1');
// db.UserSchema.drop


var cheerio = require("cheerio");
var request = require("request");



var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var cookieParser = require('cookie-parser')
var session = require('express-session');


// to configure :

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data




app.use(session({ secret: 'this is the secret' }));
// resave: true,
//  saveUninitialized: true
//})); // encrypted, sign the session id with this given string only if u have this string u can use it; paswd for session id 
app.use(cookieParser());  // parse cookie and create a map we can use 
app.use(passport.initialize());
app.use(passport.session()); // U NEED TO CONFIGURE PASSPORT'S SESSION AFTER U CONFIGURE EXPRESSES SESSION. THIS ORDER IS VERY IMP

app.use(express.static(__dirname + '/public'));

//-------------------------------------------

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    first: String,
    last: String,
    email: String

}, { collection: "UserModel" });


var UserModel = mongoose.model("UserModel", UserSchema);


//var alice = new usermodel({

//    username: 'alice',
//    password: 'alice',
//    first: 'alice',
//    last: 'wonderland',
//    email: 'alice@wonderland.com'
//});
//alice.save();


//-------------------------------------------






var name; // name given by the user to that url




var users =
    [{ username: 'alice', password: 'alice', firstName: 'Alice', lastName: 'Wonderland', roles: ['admin', 'teacher'] },
    { username: 'charlie', password: 'charlie', firstName: 'Charlie', lastName: 'Wonderland', roles: ['teacher'] },
    { username: 'meera', password: 'meera', firstName: 'Meera', lastName: 'Udani', roles: ['student'] }


    ];


//------------------------------------------------------

var auth = function (req, res, next) {

    if (!req.isAuthenticated()) {
        res.send(401);

    }

    else
        next();
};



//------------------------------------------------------


app.get('/loggedin', function (req, res) {
    res.send(req.isAuthenticated() ? req.user : '0');

});



app.post('/check', function (req, res) {


    //console.log(req.body.username);
    var username = req.body.username;
    console.log("server username check  " + username);
    var password = req.body.password;
    var first = req.body.first;
    var last = req.body.last;
    var email = req.body.email;
    console.log(" server check     pswd  " + password + "fist last email  " + first + "   " + last + "  " + email);

    UserModel.findOne({ username: username }, function (err, user) {
        if (user) {
            console.log("found user   " + user);
            res.send("1");
            //return done(null, false, { message: 'User already exists' });


        }
        else {

            console.log(" user not found");
            console.log("when user is not found   " + user);
            res.send("0");
            //res.send(user);
            //return done(null, user);
        }


    });

});





app.post('/register', function (req, res) {
    //var newUser = new UserModel(req.body);
    var username = req.body.username;
    console.log("server register username  " + username);
    var password = req.body.password;
    var first = req.body.first;
    var last = req.body.last;
    var email = req.body.email;
    console.log("server register     pswd  " + password + "fist last email  " + first + "   " + last + "  " + email);

    var newUser = new UserModel({
        username: username,
        password: password,
        first: first,
        last: last,
        email: email
    })
    console.log(newUser);
    newUser.save(function (err, user) {

        req.login(user, function (err) {

            if (err) {
                return next(err);
            }
            res.json(user);
        });

    });

});



app.post('/api/scrap', function (req, res) {
    //console.log(" started");
    name = req.body.name;
    var link = req.body.link;
    var choice = req.body.choice;
    console.log("The choice of user displayed in the server    " + choice);
    //console.log("server from " + name);
    /*
    request('http://www.google.com', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body) // Show the HTML for the Google homepage. 
        }
    })
    */
    var parsedResults = [];

    request({
        url: link,
    }, function (error, response, html) {
        //console.log("from request fun in server " + link);
        var $ = cheerio.load(html);

        if (choice == 'p' || choice == 'div') {
            $(choice).each(function () {

                var data = $(this).text();

                //console.log(data);
                var jsonData = {

                    dataUrl: link,
                    tagData: data
                };



                parsedResults.push(jsonData);
            });
        }
        else {

            $('p', 'div').each(function () {

                var data = $(this).text();

                //console.log(data);
                var jsonData = {

                    dataUrl: link,
                    tagData: data
                };



                parsedResults.push(jsonData);
            });
        }

        res.send(parsedResults);

    });

});


var likedData = [];  // user's saved data for that URL





var UserDataSchema = new mongoose.Schema({
    userName: String,
    savedData: Array

}, { collection: "UserData" });


var UserData = mongoose.model("UserData", UserDataSchema);


app.post('/api/save', auth, function (req, res) {
    //console.log(req.body.d);

    var d1 = new UserData({ userName: 'Meera', savedData: req.body.d });
    d1.save(function () {
        UserData.find(function (err, docs) {
            if (err != null)
            { res.send('/failure'); }
            else
            {
                console.log('saved');
                res.send('/done');
            }

        });

    });


});



passport.use(new LocalStrategy(
    function (username, password, done) {

        UserModel.findOne({ username: username, password: password }, function (err, user) {
            if (user) {
                return done(null, user);

            }
            return done(null, false, { message: 'Unable to login' });

        });

        //for (var u in users) {
        //    if (username == users[u].username && password == users[u].password) {
        //        return done(null, users[u]);
        //    }

        //}
    }
        ));


passport.serializeUser(function (user, done) {  // to encrypt
    done(null, user);

});

passport.deserializeUser(function (user, done) {  // to decrypt
    done(null, user);

});




app.post('/login', passport.authenticate('local'), function (req, res) {

    var user = req.body;
    //console.log("cookies:  " + req.cookies);
    res.json(user);
});



app.post('/api/userdata', auth, function (req, res) {
    //console.log(req.body.d);
    console.log("in server userdata")
    var userdata = UserData.find({ userName: 'ABC' }, 'savedData.dataUrl', function (err, docs) {
        console.log(docs);
        res.json(docs);
    });



});



app.post('/logout', function (req, res) {

    req.logout();
    res.send(200);
});







/*     // SIR'S EXAMPLE: 

app.get('/api/form', function (req, res) {
    Form.find(function (err, data) {
        res.json(data);
    });
});

app.get('/api/form/:id', function (req, res) {
    Form.findById(req.params.id, function (err, data) {
        res.json(data);

    });
});
*/

//-----



app.post('/api/data', function (req, res) {
    var like = req.body.sdata;

    likedData.push(like);

});


var port = process.env.OPENSHIFT_NODEJS_IP || 3000;
var ip = process.env.OPENSHIFT_NODEJS_PORT || '127.0.0.1';


app.listen(port, ip);