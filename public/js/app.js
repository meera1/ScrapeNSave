

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
        templateUrl: '/home/home.html',
        controller: 'HomeController'
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
    when('/open', {
        templateUrl: 'user/open.html',
        controller: 'ProfileController'
    }).
    when('/usershow', {
        templateUrl: 'user/userprofile.html',
        controller: 'HomeController'
    }).
    when('/logout', {
        templateUrl: '/home/home.html',
        controller: 'ScrapingController'
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
            //$scope.name = $rootScope.currentUser.username;
        }
        // User is not authenticated
        else {
            $rootScope.errorMessage = 'You Need To Log In Please';
            deferred.reject();
            $location.url('/login');
            $('#myname').hide();
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




//----------------------------------------------------------------------------------------------/// HomeController Start----------------------



app.controller("HomeController", function ($scope, $http, $location, $rootScope) {

    //console.log("in home controller");


    $scope.showUser = function (username) {
        $http.post('/showuser', {username : username})
          .success(function (res) {
              console.log("in success of show user");
              //   console.log(res[0].urldata[0]);
              $rootScope.userProfile = res;
              $location.url('/usershow');

          })
          .error(function (res) {
              console.log("in error of of show use angular");
              console.log("Error:" + res);
          });


    };



    $scope.follow = function(user)
    {
        console.log(user);


        $http.get('/loggedin').success(function (use) {
            console.log("in follow....loggedin success");

            $rootScope.errorMessage = null; // User is Authenticated

            if (use != '0') 
            {
                console.log("authenticated");

                $http.post('/follow', { current: $rootScope.currentUser.username, username1: user })
                .success(function (res) {
                    console.log("follow success angular");
                    $scope.currentUser = res;
                })
                .error(function (res) {
                    console.log("Error:" + res);
                });

            }
            else {
                console.log("in follow....loggedin success...user authenticated...res = 0");
                $rootScope.errorMessage = 'You Need To Log In Please';
                $location.url('/login');
                //$('#myname').hide();
            }



        })
        .error(function (res) {
            console.log("in follow....loggedin error");
            console.log('Error:' + res);
        });
}

    //----

    $scope.unfollow = function (user) {
        console.log(user);


        $http.get('/loggedin').success(function (use) {
            console.log("in unfollow....loggedin success");

            $rootScope.errorMessage = null; // User is Authenticated

            if (use != '0') {
                console.log("authenticated");

                $http.post('/unfollow', { current: $rootScope.currentUser.username, username1: user })
                .success(function (res) {
                    console.log("unfollow success angular");
                    $scope.currentUser = res;
                })
                .error(function (res) {
                    console.log("Error:" + res);
                });

            }
            else {
                console.log("in unfollow....loggedin success...user authenticated...res = 0");
                $rootScope.errorMessage = 'You Need To Log In Please';
                $location.url('/login');
                //$('#myname').hide();
            }



        })
        .error(function (res) {
            console.log("in unfollow....loggedin error");
            console.log('Error:' + res);
        });
    }




    //----





    var init = function () {
        console.log("in init");
        $http.get('/sharedData')
           .success(function (res) {
               console.log("in success of shared data angular");
            //   console.log(res[0].urldata[0]);
               $scope.wallresults = res;

           })
           .error(function (res) {
               console.log("in error of shared data angular");
               console.log("Error:" + res);
           });


    };
    // and fire it after definition
    init();

    /*
    
    function HomeController($scope) {
        console.log("in home controller scope function");
        angular.element(document).ready(function () {

            console.log("in home controller ready function before sending request");


            $http.get('/sharedData')
            .success(function (res) {
                console.log("in success of shared data angular");
                $scope.sharedData = res;

            })
            .error(function (res) {
                console.log("in error of shared data angular");
                console.log("Error:" + res);
            });


        });
    }


    */

    


});





//----------------------------------------------------------------------------------------------/// HomeController End----------------------









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


//----------------------------------------------------------------------------------------------/// ProfileController Start----------------------




app.controller("ProfileController", function ($scope, $http, $location, $rootScope, $window) {



  //---------------------------------------------------------------------------------------------------
    // $location.path("/clearall");
    $scope.askToScrape = function () {
        $location.path("/main");
        $('#loginId').hide();
        $('#registerId').hide();
    };


    //---------------------------------------------------------------------------------------------------


    $scope.loadUrl = function () {
        //$location.path("/userdata");
        console.log($rootScope.currentUser.username);


        $http.post('/loadurls', { username: $rootScope.currentUser.username })
            .success(function (res) {
                if (res.length > 0)
                {
                    $scope.yourUrls = res;
                }
                else
                {
                    $scope.conditions = 'No Records Found!!!';
                }
                
            })
            .error(function (res) {

                console.log("Error from retrieving your url's" + res);
            });
    }


    //---------------------------------------------------------------------------------------------------

        $scope.editData = function (y) {
            console.log('in edit    ' + y.urlname);
            
            $scope.urlnameOld = y.urlname;
            $scope.urlname1 = y.urlname;
            console.log($scope.urlname1 + "     " + $scope.urlnameOld);
            //$scope.actualurl1 = y.actualurl;
            //$('myTr').show();
             
        };

        

    //---------------------------------------------------------------------------------------------------


        $scope.openData = function (y) {
            console.log('in open    ' + y.urlname);
            var urlname = y.urlname;

            $http.post('/opendata', { username: $rootScope.currentUser.username, urlname: urlname })
            .success(function (res) {

                $rootScope.opendata = res;
                //console.log($scope.opendata.urlname);
                $location.url('/open');
            })
            .error(function (res) {

                console.log("Error  " + res);
            });
        };



    //---------------------------------------------------------------------------------------------------




        $scope.shareData = function (urlname, actualdata) {


            console.log("--------------------------------------------------------------------------------------");

            $http.post('/share', { username: $rootScope.currentUser.username, urlname: urlname, actualdata: actualdata })
            .success(function (res) {

                //$window.alert("Done!");
                $rootScope.opendata = res;
               
            })
            .error(function (res) {

                console.log("Error  " + res);
            });

        };
      
    
    //---------------------------------------------------------------------------------------------------


        $scope.updateData = function (urlnameOld,urlname1) {
            console.log(urlnameOld);
            $http.post('/updateData', { urlname: urlname1, urlnameOld: urlnameOld, username: $rootScope.currentUser.username })
            .success(function (res) {
                console.log("Success  " + res);
                $scope.yourUrls = res;
                $window.alert("Done Updating!");
            })
            .error(function (res) {

                console.log("Error  "+res);
            });


        };

    //---------------------------------------------------------------------------------------------------







});

















//----------------------------------------------------------------------------------------------/// ProfileController End----------------------


////----------------------------------------------------------------------------------------------/// OpenController Start------------------------


//app.controller("OpenController", function ($scope, $http, $location, $rootScope) {

//    $scope.opendata = re

//});







////----------------------------------------------------------------------------------------------/// OpenCOnroller Start------------------------



//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\




//----------------------------------------------------------------------------------------------/// UserController Start----------------------



app.controller("UserController", function ($scope, $http, $location, $rootScope) {


  /////////////////////////////////////////////


    $scope.scrapeMore = function () {
        $location.url("/main");
    };


    $scope.loadUrl = function () {
        //$location.path("/userdata");
        console.log($rootScope.currentUser.username);


        $http.post('/loadurls', { username: $rootScope.currentUser.username })
            .success(function (res) {
                if (res.length > 0) {
                    $scope.yourUrls = res;
                }
                else {
                    $scope.conditions = 'No Records Found!!!';
                }

            })
            .error(function (res) {

                console.log("Error from retrieving your url's" + res);
            });
    }


    //--------------------------------------------------------------------------------------


    $scope.editData = function (y) {
        console.log('in edit    ' + y.urlname);

        $scope.urlnameOld = y.urlname;
        $scope.urlname1 = y.urlname;
        console.log($scope.urlname1 + "     " + $scope.urlnameOld);
        //$scope.actualurl1 = y.actualurl;
        //$('myTr').show();

    };



    //---------------------------------------------------------------------------------------------------


    $scope.openData = function (y) {
        console.log('in open    ' + y.urlname);
        var urlname = y.urlname;

        $http.post('/opendata', { username: $rootScope.currentUser.username, urlname: urlname })
        .success(function (res) {

            $rootScope.opendata = res;
            //console.log($scope.opendata.urlname);
            $location.url('/open');
        })
        .error(function (res) {

            console.log("Error  " + res);
        });
    };



    //---------------------------------------------------------------------------------------------------




    $scope.shareData = function (urlname, actualdata) {


        console.log("--------------------------------------------------------------------------------------");

        $http.post('/share', { username: $rootScope.currentUser.username, urlname: urlname, actualdata: actualdata })
        .success(function (res) {

            $window.alert("Done!");
            $rootScope.opendata = res;

        })
        .error(function (res) {

            console.log("Error  " + res);
        });

    };


    //---------------------------------------------------------------------------------------------------


    $scope.updateData = function (urlnameOld, urlname1) {
        console.log(urlnameOld);
        $http.post('/updateData', { urlname: urlname1, urlnameOld: urlnameOld, username: $rootScope.currentUser.username })
        .success(function (res) {
            console.log("Success  " + res);
            $scope.yourUrls = res;
            $window.alert("Done Updating!");
        })
        .error(function (res) {

            console.log("Error  " + res);
        });


    };

    //---------------------------------------------------------------------------------------------------













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

        var c = 0;
        for (var i = 0; i < $scope.datum.length; i++) {

            if (s == $scope.datum[i]) {
                c = 1;
            }

           
        }

        if (c == 0) {
            $scope.datum.push(s);
        }
        

        console.log("datum in angular   " + s.dataUrl);
        console.log("datum in angular   " + s.tagData);

        console.log("data frm frnt end  " + s);

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
        //console.log("datum in angular  rmonw " + d.dataUrl);
        //console.log("datum in angular remove  " + d.tagData);

        var index = $scope.datum.indexOf(d);
        $scope.datum.splice(index, 1);
    };

//----------------------------------------------------------------------------

    $scope.savePicks = function () {
        
        console.log("Datum data  the user wants to save      " + $scope.datum);

        $http.get('/loggedin').success(function (user) {
            console.log("in savepicks....loggedin success");

            $rootScope.errorMessage = null; // User is Authenticated

            if (user != '0') {

                console.log("in savepicks....loggedin success...user authenticated...res != 0");
                $http.post('/checkname', //{
                        //    username: user.username,
                        //    password: user.password,
                        //    first: user.first,
                        //    last: user.last,
                        //    email: user.email
                        //}
                    { urlname: $scope.url.linkname, username: $rootScope.currentUser.username })
                        .success(function (res) {
                            console.log("in savepicks....loggedin success...in /checkname success");
                            if (res == "1") {
                                console.log("in savepicks....loggedin success...in /checkname success   res = 1");
                                //user exists
                                window.alert("URL name not unique, please enter another one");

                            }
                            else if (res == "0") {
                                console.log("in savepicks....loggedin success...in /checkname success   res = 0");
                                $http.post("/api/save", { d: $scope.datum, actualurl: $scope.url.link1, urlname: $scope.url.linkname, username: $rootScope.currentUser.username })
                                            .success(function (res) {
                                                console.log("in savepicks....loggedin success...in /checkname success...savepicks success");
                                                console.log(res);

                                                // $location.path("/error");
                                                $location.path(res);
                                                //$scope.$apply();

                                            })

                                            .error(function (res) {
                                                console.log("in savepicks....loggedin success...in /checkname success...savepicks error");
                                                console.log('Error: ' + res);
                                                $window.alert("Could not save, try again");
                                                $location.url('/main');
                                            });

                            }
                        })
                            .error(function (res) {
                                console.log("in savepicks....loggedin success...in /checkname error");
                                console.log('Error: ' + res);

                            });







            }

            else {
                console.log("in savepicks....loggedin success...user authenticated...res = 0");
                $rootScope.errorMessage = 'You Need To Log In Please';
                $location.url('/login');
                //$('#myname').hide();
            }



        })
        .error(function (res) {
            console.log("in savepicks....loggedin error");
            console.log('Error:' + res);
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
            $("#loginId").hide();
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




        // $location.path("/clearall");
        $scope.logout = function () {

            $http.post('/logout')
            .success(function () {
                $('#loginId').show();
                $('#registerId').show();
                $location.url("/home");

            });

        };


//----------------------------------------------------------------------------








});

//--------------------Pagination----------------------


//app.filter('offset', function () {
//    return function (input, start) {
//        start = parseInt(start, 10);
//        return input.slice(start);
//    };
//});


//$scope.itemsPerPage = 5;
//$scope.currentPage = 0;
//$scope.items = [];

//for (var i = 0; i < 50; i++) {
//    $scope.items.push({
//        id: i, name: "name " + i, description: "description " + i
//    });
//}

//$scope.prevPage = function () {
//    if ($scope.currentPage > 0) {
//        $scope.currentPage--;
//    }
//};

//$scope.prevPageDisabled = function () {
//    return $scope.currentPage === 0 ? "disabled" : "";
//};

//$scope.pageCount = function () {
//    return Math.ceil($scope.items.length / $scope.itemsPerPage) - 1;
//};

//$scope.nextPage = function () {
//    if ($scope.currentPage < $scope.pageCount()) {
//        $scope.currentPage++;
//    }
//};

//$scope.nextPageDisabled = function () {
//    return $scope.currentPage === $scope.pageCount() ? "disabled" : "";
//};



//----------------------------------------------------



//----------------------------------------------------------------------------------------------/// ScrapingController End-------------------------


//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
