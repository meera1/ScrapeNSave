"use strict";

// load q promise library
var q = require("q");
var bcrypt = require('bcryptjs');


module.exports = function (db, mongoose) {

    var UserSchema = require("./user.schema.server.js")();
    var UserModel = mongoose.model("UserModel", UserSchema);

    var api = {
        createUser : createUser,
        findUserByUsername : findUserByUsername,
        comparePassword : comparePassword,
        getUserById: getUserById
    };
    return api;

    function createUser(user) {
        var newUser = {
          username : user.username,
            password: user.password1,
            firstName : user.firstName,
            lastName : user.lastName,
            email : user.email,
            follows : [],
            followedBy : []
        };

        var deferred = q.defer();

        // insert new user with mongoose user model's create()
        UserModel.create(newUser, function (err, doc) {
            if(err)
                // reject promise
                deferred.reject(err);
            else
                // resolve promise
                deferred.resolve(doc);
        });
        return deferred.promise;
    }
    
    function findUserByUsername(username) {
        var deferred = q.defer();

        // find one retrieves one document
        UserModel.findOne(
            // first argument is predicate
            { username: username},

            // doc is the unique instance matches predicate
            function (err, doc) {
                if(err){
                    // reject promise if error
                    deferred.reject(err);
                }
                else{
                    // resolve promise
                    deferred.resolve(doc);
                }
            });
        return deferred.promise;
    }

    function getUserById(id, callback) {
        UserModel.findById(id, callback);
    }

    function comparePassword(candidatePassword, password, callback) {
        bcrypt.compare(candidatePassword, password, function(err, isMatch) {
            if(err)
                throw err;
            callback(null, isMatch);
        });
    }

}