

var app = angular.module("ScrapingApp", ['ngRoute']);


app.config(['$routeProvider',

function ($routeProvider) {
    //console.log("i am here");
    $routeProvider.
      when('/done', {

          templateUrl: 'user/user1.html',
          controller: 'UserController'
      }).
    when('/main', {
        templateUrl: 'main/main.html',
        controller: 'ScrapingController'
    }).
    when('/userdata', {
        templateUrl: 'user/userdata.html',
        controller: 'UserDataController',
        resolve: {
            loggedin: checkLoggedIn,
        }
    }).
    when('/clearall', {
        templateUrl: 'clear/clearall.html',
        controller: 'ClearController'
    }).
    when('/home', {
        templateUrl: 'home/home.html',
        //controller:
    }).
     when('/profile', {
         templateUrl: 'user/profile.html',
         controller: 'ProfileController',
         resolve: {
             loggedin : checkLoggedIn,
         }
     }).
     when('/', {
         templateUrl: 'main/main.html',
         controller: 'ScrapingController'
     }).
    when('/login', {
        templateUrl: 'login/login.html',
        controller: 'ScrapingController'
    }).
    when('/register', {
        templateUrl: 'register/register.html',
        controller: 'RegisterController'
    }).
    when('/logout', {
        templateUrl: 'home/home.html',
        controller: 'NavController'
    });
        /* .
    otherwise({
        redirectTo: '/clearall'    */
   
     
      



}]);



//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//----------------------------------------------------------------------------------------------/// checkLoggedIn function Start----------------------



var checkLoggedIn = function ($q, $timeout, $http, $location, $rootScope, $window) {

    var deferred = $q.defer();

    $http.get('/loggedin').success(function (user) {

        $rootScope.errorMessage = null; // User is Authenticated

        if (user != '0') {
            $rootScope.currentUser = user;
            deferred.resolve();
            $('#loginId').hide();
            $('#registerId').hide(); 
        }
        // User is not authenticated
        else {
            $rootScope.errorMessage = 'You Need To Log In Please';
            deferred.reject();
            $location.url('/login');

        }

    });

    return deferred.promise;
};


//----------------------------------------------------------------------------------------------/// checkLoggedIn function End----------------------






///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




//----------------------------------------------------------------------------------------------/// ClearController Start----------------------



app.controller("ClearController", function ($scope, $http, $location) {

   // $location.path("/clearall");
    $scope.clearRedirect = function () {
        $location.path("/home");

    };


});





//----------------------------------------------------------------------------------------------/// ClearController End----------------------



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



//----------------------------------------------------------------------------------------------/// RegisterController Start----------------------


app.controller("RegisterController", function ($scope, $http, $location, $rootScope, $window) {

   

    $scope.register = function (user) {
        console.log("in app first step   "+ user);
        if (user.password == user.password2)
        {

            $http.post('/check', //{
            //    username: user.username,
            //    password: user.password,
            //    first: user.first,
            //    last: user.last,
            //    email: user.email
            //}
            user)
                .success(function (res) {

                    if (res == "1") {
                        //user exists
                        window.alert("User already exists");
                    }
                    else if (res == "0")
                    {

                        $http.post("/register", // {
                        //    username: user.username,
                        //    password: user.password,
                        //    first: user.first,
                        //    last: user.last,
                        //    email: user.email
                        //}
                        user)
                    .success(function (res) {
                        console.log(" success response of check the new user" + res);
                        $rootScope.currentUser = res;
                        $location.url('/profile');
                    });
                        //.error(function (res) {
                        // console.log("failure response of check" + res);
                        // $window.alert("Your have already registered. Kindly log-in");
                        // $location.url('/login');




                        //      if (user != '0') {
                        //          $rootScope.currentUser = user;
                        //          deferred.resolve();
                        //      }
                        //    // User is not authenticated
                        //else {
                        //       $rootScope.errorMessage = 'You Need To Log In Please';
                        //    deferred.reject();
                        //    $location.url('/login');

                        //}
                    }


                });

        }
        else
        {
            $window.alert("Passwords Don't Match");
        }
       
    };

});




//----------------------------------------------------------------------------------------------/// RegisterController End----------------------






///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////






app.controller("ProfileController", function ($scope, $http, $location) {

    // $location.path("/clearall");
    $scope.askToScrape = function () {
        $location.path("/main");

    };


});













//----------------------------------------------------------------------------------------------/// ProfileController End----------------------










//----------------------------------------------------------------------------------------------/// NavController Start----------------------



app.controller("NavController", function ($scope, $http, $location) {

    // $location.path("/clearall");
    $scope.logout = function(){
        
        $http.post('/logout')
        .success(function () {
            $location.url("/home");

        });

    };


    


});




//----------------------------------------------------------------------------------------------/// NavController End----------------------






//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\







//----------------------------------------------------------------------------------------------/// UserController Start----------------------
app.controller("UserController", function ($scope, $http, $location) {            
    

    



    $scope.loadUrl = function () {
        $location.path("/userdata");

    };

});


//----------------------------------------------------------------------------------------------/// UserController End-------------------------








//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\







//----------------------------------------------------------------------------------------------/// UserDataController Start----------------------

app.controller("UserDataController", function ($scope, $http, $location) {
    $http.post("/api/userdata")
        .success(function (res) {
            $scope.userurl = res;
            console.log('done displaying user data');
            // $scope.scrapeMore = true;
        })
        .error(function (res) {
            console.log('Error: ' + res);
            $window.alert("Please Login First");
        });

});

//----------------------------------------------------------------------------------------------/// UserController End-------------------------







//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\







//----------------------------------------------------------------------------------------------/// ScrapingController Start----------------------

app.controller("ScrapingController", function ($scope, $http, $location, $window, $rootScope) {

  

//----------------------------------------------------------------------------

    $scope.urlSubmit = function (url) {
        //var link1 = $scope.link1;
        console.log("i m here " + $scope.url.linkName);
        console.log("from app the link name and it's url   " + $scope.url.linkName + "  " + $scope.url.link1);
        console.log("choice of user  " + $scope.url.choice);
        var ch = $scope.url.choice;
        $http.post("/api/scrap", { link: $scope.url.link1, name: $scope.url.linkName, choice: $scope.url.choice})
        .success(function (res) {
            $scope.scrap = res;
            $scope.choice = ch;
           // $scope.scrapeMore = true;
        })
        .error(function (res) {
            console.log('Error: ' + res);
        });

    };

//----------------------------------------------------------------------------

    $scope.datum = [];

    $scope.addData = function (s) {
        $scope.datum.push(s);

        /*
         $http.post("/api/data", {surl: s.dataUrl , sdata: s.tagData })
         .success(function (res) {
             $scope.addedData = res;
             //var index = $scope.movies.indexOf(movie);
             //datas.splice(s, 1);
             //$scope.scrap = datas;
         })
 
         .error(function (res) {
             console.log('Error: ' + res);
         });
      */
    };


//----------------------------------------------------------------------------


    $scope.removeData = function (d) {
        var index = $scope.datum.indexOf(d);
        $scope.datum.splice(index, 1);
    };

//----------------------------------------------------------------------------

    $scope.savePicks = function () {
        $http.post("/api/save", { d: $scope.datum })
        .success(function (res) {
            console.log(res);

            // $location.path("/error");
            $location.path(res);
            //$scope.$apply();

        })

        .error(function (res) {
            console.log('Error: ' + res);
            $window.alert("Please Login First");
            $location.url('/login');
        });
    };


//-----------------------------------------------------------------------------



    $scope.login = function (user) {
        console.log(user);
        if (user == $rootScope.currentUser) {
            console.log("got in")
            $window.alert("You have already logged in");

        }
        else {

            $http.post('/login', user)
        .success(function (user) {
            console.log(user);  /// ask the entire user object to display in the user profile 
            $rootScope.currentUser = user;
            //$('#exampleModal').modal('hide');
            //$scope.mymodal.hide();
            $location.url("/profile");
        })
        .error(function (response) {
            //$('#exampleModal').modal('show');
            // $('#myModal').modal({
            //   backdrop: static
        });
        }
        
         
    };


//----------------------------------------------------------------------------



});





//----------------------------------------------------------------------------------------------/// ScrapingController End-------------------------


//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
