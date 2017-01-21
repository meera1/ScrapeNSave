"use strict";
var mongoose = require("mongoose");

module.exports = function () {
    var UserScrapeData = new mongoose.Schema({
        username : String,
        listofurls: [
            {
                urlname: String,
                actualurl: String
            }
            ],
    }, { collection: "UserScrapeData"});
    return UserScrapeData;
}