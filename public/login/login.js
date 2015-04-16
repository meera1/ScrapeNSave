app.controller("LoginCtrl", function ($scope, $http) {

    console.log("I m in login.js");
     
    $scope.login = function (user) {
        console.log(user);

        $http.post("/login", user)
        .success(function (res) {
           console.log(res);
         } );
        
    };

}); 