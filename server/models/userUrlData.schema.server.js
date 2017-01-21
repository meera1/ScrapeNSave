"use strict";

var mongoose = require("mongoose");

module.exports = function () {
    var UserUrlData = new mongoose.Schema({

        username: String,
        urlname: String,
        actualurl: String,
        tagtype: String,
        urldata:
            [{
                actualdata: String,
                index: Number,
                visibility: { type: String, default: 'Private' }
            }]

    }, { collection: "UserUrlData   " });
    return UserUrlData;
}