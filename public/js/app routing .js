

var app = angular.module("IndexApp", ['ngRoute']);


//app.controller("IndexController", function ($scope, $http, $location) {



app.config(['$routeProvider',
   function($routeProvider) {
       $routeProvider.
           when('/done', {
               templateUrl: 'done/done.html'
           }).
           when('/failure', {
               templateUrl: 'public/failure/failure.html'

           }).
           when('/user', {
               templateUrl: 'public/user/user.html',
			   controller: 'ScrapingController'
           }).
                      
           otherwise({
            redirectTo: '/user'
        });
   }]);
});

