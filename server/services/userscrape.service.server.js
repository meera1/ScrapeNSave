"use strict";

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function (app, db, mongoose, userModel, userScrapeDataModel, userUrlDataModel) {

    var auth = authorized;

    app.post("/api/user/login", passport.authenticate('local'),login);
    app.get("/api/user/loggedin", loggedIn);
    app.post("/api/user/logout", logout);
    app.post("/api/user/register", register);
    // app.get("/api/scrape/profile/:userId",profile);
    // app.post("/api/scrape/follow", follow);
    // app.post("/api/scrape/unfollow", unfollow);
    // app.get("/api/scrape/sharedData", getGlobalSharedData);
    // app.post("api/scrape/user/share", saveUserSharedData);
    // app.get("/api/scrape/user/loadUrls", getUserScrappedUrls);
    // app.get("/api/scrape/user/urlData", getUserSelectedUrlData);
    // app.post("/api/scrape/user/editUrlEntry", updateUrlEntry);
    // app.get("/api/scrape/scrapedata", scrapeUrl);
    // app.post("/api/scrape/user/savePicks", saveUserPicks);
    app.get("/api/user/check/:username", checkUserName);


    function logon(req, res){
        console.log("In server :: User Service :: logon");
        var user = req.user;
        res.json(user);
    }

    function loggedIn(req, res) {
        res.json(req.session.currentUser);
    }

    function login(req, res) {
        var user = req.body;
        res.json(user);
    }

    function authorized (req, res, next) {
        console.log("In server :: User Service :: authorized");
        if (!req.isAuthenticated()) {
            res.send(401);
        } else {
            next();
        }
    }

    function logout(req, res) {
        console.log("In server :: User Service :: logout");
        req.logOut();
        res.send(200);

    }

    function checkUserName(req, res) {
        console.log("in user scrape service server :: checkUserName");
        var username = req.params.username;
        userModel.findUserByUsername(username)
            .then(function (user) {
                req.session.currentUser = user;
                res.json(user);
            }, function (err) {
                res.status(400).send(err);
            });
    }
    
    // function profile(req, res) {
    //     var userId = req.params.userId;
    //     var user = null;
    //
    //     // use model to find user by id
    //     userModel.findUserById(userId)
    //         .then(
    //             //first retrieve the user by id
    //             function (doc) {
    //                 user = doc;
    //
    //             },
    //             // reject promise if error
    //             function (err) {
    //                 res.status(400).send(err);
    //             }
    //         )
    // }

    function register(req, res) {
        console.log("in user scrape service server :: register");
        var user = req.body;
        userModel.createUser(user)
            .then(function (user) {
                req.session.currentUser = user;
                res.json(user);
                // req.login(user, function (error) {
                //     if(error)
                //         res.status(400).send(error);
                //     else
                //         res.json(user);
                // });
            }, function (error) {
                res.status(400).send(error);
            });
    }

    passport.use(new LocalStrategy(
        function(username, password, done) {
            userModel.findUserByUsername(username, function (err, user) {
                if(err)
                    throw err;
                if(!user){
                    return done(null, false, {message: 'Unknown User'});
                }
                userModel.comparePassword(password, user.password, function (err, isMatch) {
                    if(err)
                        throw err;
                    if(isMatch){
                        return done(null, user);
                    }
                    else{
                        return done(null, false, {message: 'Invalid Password'});
                    }
                })
            });
        }
    ));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        userModel.getUserById(id, function(err, user) {
            done(err, user);
        });
    });

}