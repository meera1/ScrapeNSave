app.controller("RegisterController", function ($scope, $http, $location, $rootScope) {

    console.log("I m in login.js");

    $scope.register = function (user) {
        console.log(user);

        $http.post("/register", user)
        .success(function (res) {
            console.log("response   " + res);
            $rootScope.currentUser = res;
            $location.url('/profile');

        });

    };

});