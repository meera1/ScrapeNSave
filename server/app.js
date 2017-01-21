

// pass db and mongoose reference to server side application module
module.exports = function (app, db, mongoose) {
    // pass db and mongoose reference to model
    var userModel = require("./models/user.model.server.js")(db, mongoose);
    var userScrapeDataModel = require("./models/userScrapeData.model.server.js")(db, mongoose);
    var userUrlDataModel = require("./models/userUrlData.model.server.js")(db, mongoose);

    var userScrapeService = require("./services/userscrape.service.server.js")(app, db, mongoose, userModel, userScrapeDataModel, userUrlDataModel);

}