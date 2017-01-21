"use strict";

module.exports = function (db, mongoose) {
    var UserUrlDataSchema = require("./userUrlData.schema.server.js")();
    var UserUrlDataModel = mongoose.model("UserUrlDataModel", UserUrlDataSchema);

    var api = {

    }
    return api;
}