"use strict";
(function () {
    angular
        .module("ScrapeApp")
        .factory("ScrapeService", scrapeService);

    function scrapeService($http, $rootScope) {
        var api = {
            scrapeData : scrapeData,
            getSharedData : getSharedData
        };

        return api;

        function scrapeData(url) {
            return $http.get("/api/scrape/scrapeUrl", url);
        }

        function getSharedData() {
            return $http.get("/api/scrape/sharedData");
        }
    }
})();