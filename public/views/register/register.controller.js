"use strict";
(function () {
    angular
        .module("ScrapeApp")
        .controller("RegisterController", registerController);

    function registerController(UserService, $location, sweet) {
        var vm = this;
        vm.register = register;

        function init() {
            vm.$location = $location;
            // vm.vpassword = "";
        }
        init();
        function register(user) {
            if(user.username && user.password1 && user.password2) {
                if(user.password1 !== user.password2) {
                    sweet.show('Oops...', "Password don't match", 'error');
                    return;
                }
                UserService.findUserByUsername(user.username).then(
                    function (response){
                        if (response.data) {
                            console.log("User Already Exists");
                            sweet.show("User Already Exists!");
                            return;
                        } else {
                            UserService.createUser(user).then(
                                function(response){
                                    if (response.data) {
                                        UserService.setCurrentUser(response.data);
                                        $location.url("/profile");
                                    }
                                },function(error){
                                    console.log(error);
                                    sweet.show('Oops...', error.data.message, 'error');
                                });
                        }
                    });
            } else {
                sweet.show('Oops...', 'Please complete details', 'error');
            }

        }
    }
})();