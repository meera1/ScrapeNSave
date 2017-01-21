"use strict";
(function () {
    angular
        .module("ScrapeApp")
        .controller("ScrapeWallController", scrapeController);
    
    function scrapeController(ScrapeService, $location) {
        var vm = this;
        vm.scrapeData = scrapeData;

        function init() {

        }
        init();

        function scrapeData(url) {
            console.log(url);
            ScrapeService
                .scrapeData(url)
                .then(function (response) {
                    var scrappedData = response.data;
                    if(scrappedData != null){
                        vm.data = scrappedData;
                        console.log(data);
                    }
                });
        }
    }
})();