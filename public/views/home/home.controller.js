"use strict";
(function () {
    angular
        .module("ScrapeApp")
        .controller("HomeController", homeController);
    
    function homeController(ScrapeService, $location) {
        var vm = this;
        vm.getSharedData = getSharedData;

        function init() {
            ScrapeService
                .getSharedData()
                .then(function (response) {
                    if(response.data)
                        vm.sharedData = response.data;
                })
        }
        init();

        function getSharedData() {

        }
    }
    
})();