"use strict";
(function () {
    angular
        .module("ScrapeApp")
        .factory("UserService", userService);
    
    function userService($http, $rootScope) {
        var api = {
            login: login,
            setCurrentUser: setCurrentUser,
            getCurrentUser: getCurrentUser,
            findUserByUsername: findUserByUsername,
            findUserByCredentials: findUserByCredentials,
            createUser : createUser,
            register: register,
            logout: logout,
            getProfile: getProfile
        };
        return api;

        function getProfile() {
            return $http.get("/api/scrape/profile/"+$rootScope.currentUser._id);
        }

        function register(user) {
            return $http.post("/api/scrape/register", user);
        }

        function logout() {
            return $http.post("/api/scrape/logout");
        }
        
        function getCurrentUser() {
            return $http.get("/api/scrape/loggedin");
        }
        
        function setCurrentUser(user) {
            $rootScope.currentUser = user;
        }
        
        function login(credentials) {
            return $http.post("/api/scrape/login", credentials);
        }

        function findUserByUsername(username) {
            console.log("In user service client  ::  findUserByUsername");
            return $http.get("/api/user/check/"+username);
        }

        function createUser (user) {
            console.log("In user service client :: createUser");
            return $http.post("/api/user/register",user);
        }

        function findUserByCredentials(username, password) {
            console.log("In user service client :: findUserByCredentials");
            var credentials = { username : username, password : password };
            return $http.post("/api/user/login", credentials);
        }

    }
})();