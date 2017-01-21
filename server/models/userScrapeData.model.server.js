"use strict";

module.exports = function (db, mongoose) {
    var UserScrapeDataSchema = require("./userScrapeData.schema.server.js")();
    var UserScrapeDataModel = mongoose.model("UserScrapeDataModel", UserScrapeDataSchema);

    var api = {

    }
    return api;
}