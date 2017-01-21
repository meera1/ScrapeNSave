"use strict";
(function () {
    angular
        .module("ScrapeApp")
        .controller("LoginController", loginController);

    function loginController(UserService, $location, sweet){
        var vm = this;
        vm.login = login;

        function init() {

        }
        init();

        function login(user) {
            console.log("in login view" + user.username + " " + user.password);
            if(user.username && user.password){
                UserService.findUserByCredentials(user.username, user.password)
                    .then(function (response) {
                        if(response.data){
                            UserService.setCurrentUser(response.data);
                            $location.url("/profile");
                        }
                        else{
                            sweet.show('Oops...', 'Username or Password is incorrect', 'error');
                        }
                    }, function (err) {
                        console.log(err);
                        sweet.show('Oops...', 'Username or Password is incorrect', 'error');
                    });
            }
            else{
                sweet.show('Please enter Username or Password');
            }
        }
    }

})();