"use strict"

var mongoose = require("mongoose");
var validator = require("validator"); //--------------------------------????

module.exports = function () {

    var validateEmail = function(email) {
        var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return re.test(email)
    };

    var validateUsername = function(username) {
        return /^\w+$/.test(username);
    };

    var validateName = function(name) {
        return /^[a-zA-Z]*$/.test(name);
    };

    var validatePassword = function(password) {
        return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/.test(password);
    };

    // use mongoose to declare a user schema
    var UserSchema = new mongoose.Schema({
        username: {
            unique: true,
            type: String,
            required: 'Username is required',
            validate: [validateUsername, 'Username should contain only letters, numbers and underscores']
        },
        password: {
            type : String
        },
        firstName: {
            type: String,
            validate: [validateName,  'FirstName should have only letters']
        },
        lastName: {
            type: String,
            validate: [validateName,  'FirstName should have only letters']
        },
        email: {
            type: String,
            validate: [validateEmail, 'Please fill a valid email address'],
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        },
        follows: [{
            type : String
        }],
        followedBy: [{
            type: String
        }]

    }, { collection: "User" });
    return UserSchema;
};