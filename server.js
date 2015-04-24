var express = require('express');

var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var mongoose = require('mongoose');
//var db = mongoose.connect('mongodb://localhost/practice1');

var connectionString = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/practice1';
mongoose.connect(connectionString);
// db.UserSchema.drop


var cheerio = require("cheerio");
var request = require("request");



var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var cookieParser = require('cookie-parser')
var session = require('express-session');


// to configure :

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data




app.use(session({ secret: 'this is the secret' }));
// resave: true,
//  saveUninitialized: true
//})); // encrypted, sign the session id with this given string only if u have this string u can use it; paswd for session id 
app.use(cookieParser());  // parse cookie and create a map we can use 
app.use(passport.initialize());
app.use(passport.session()); // U NEED TO CONFIGURE PASSPORT'S SESSION AFTER U CONFIGURE EXPRESSES SESSION. THIS ORDER IS VERY IMP

app.use(express.static(__dirname + '/public'));

//-------------------------------------------------------------------------------------------------------------






//--------------------To Store the user details ----------------------------------------------------------------//

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    first: String,
    last: String,
    email: String,
    follows: [String],
    followedBy: [String]

}, { collection: "UserModel" });


var UserModel = mongoose.model("UserModel", UserSchema);







//--------------------To Store the user and his/her scrapped URL's ----------------------------------------------------------------//



var UserScrapeData = new mongoose.Schema({
    username : String,
    listofurls: [{ urlname: String, actualurl: String }],
}, { collection: "UserScrapeDataModel"});


var UserScrapeDataModel = mongoose.model("UserScrapeDataModel", UserScrapeData);




//--------------------To Store all the URL's and its data ----------------------------------------------------------------//


var UserUrlData = new mongoose.Schema({

    username: String,
    urlname: String,
    actualurl: String,
    tagtype: String,
    urldata:
                [{
                actualdata: String,
                index: Number,
                visibility: { type: String, default: 'Private' }
                }]

}, { collection: "UserUrlDataModel" });


var UserUrlDataModel = mongoose.model("UserUrlDataModel", UserUrlData);


//var alice = new usermodel({

//    username: 'alice',
//    password: 'alice',
//    first: 'alice',
//    last: 'wonderland',
//    email: 'alice@wonderland.com'
//});
//alice.save();


//-------------------------------------------





   var name; // name given by the user to that url



//------------------------------------------------------

var auth = function (req, res, next) {

    if (!req.isAuthenticated()) {
        res.send(401);

    }

    else
        next();
};



//------------------------------------------------------


app.get('/loggedin', function (req, res) {
    res.send(req.isAuthenticated() ? req.user : '0');

});




app.post('/loadurls', auth, function (req, res) {
    //console.log('hi there  ' + req.body.username);
    UserScrapeDataModel.findOne({ username: req.body.username }, function (err, user) {
        if (user) {
            //console.log("user found     " + user);
            console.log("Error query  " + err);

            res.send(user.listofurls);
            //return done(null, false, { message: 'User already exists' });
        }
        else {

            res.send("0");
            //res.send(user);
            //return done(null, user);
        }


    });

});



//--------------------------------------------------------------------------------------------------------------


app.post('/follow', auth, function (req, res) {

    console.log("User in follow server *********************"+req.body.username1);
    UserModel.findOne({ username: req.body.username1 }, function (error, doc) {

        if(doc)
        {
            console.log("Got user:  " + doc);
            doc.followedBy.push(req.body.current);
            doc.save();


            UserModel.findOne({ username: req.body.current }, function (error1, doc1) {

                if(doc1)
                {
                    console.log("Got current user   " + doc1);
                    doc1.follows.push(req.body.username1);
                    doc1.save();
                    res.send(doc1);
                }
                else
                {
                    console.log("Did not get  current user:  " + error1);
                }


            });




        }
        else
        {
            console.log("Did not get user:  " + error);
        }

    });

});

//-------


app.post('/unfollow', auth, function (req, res) {

    console.log("User in unfollow server *********************" + req.body.username1);
    UserModel.findOne({ username: req.body.username1 }, function (error, doc) {

        if (doc) {
            console.log("Got user:  " + doc);
            doc.followedBy.pull(req.body.current);
            //doc.save();


            UserModel.findOne({ username: req.body.current }, function (error1, doc1) {

                if (doc1) {
                    console.log("Got current user   " + doc1);
                    doc1.follows.pull(req.body.username1);
                    doc1.save();
                    res.send(doc1);
                }
                else {
                    console.log("Did not get  current user:  " + error1);
                }


            });




        }
        else {
            console.log("Did not get user:  " + error);
        }

    });

});


//-------








//--------------------------------------------------------------------------------------------------------------

app.post('/showuser', function (req, res) {

    console.log("*************************************************** in show user");
    var wallresults = [];
    UserModel.findOne({ username: req.body.username }, function (err, user) {
        if (user) {
           
            UserUrlDataModel.find({ username: req.body.username}, function (error, docs) {


                if (docs) {

                    for (j = 0; j < docs.length; j++) {

                        for (i = 0 ; i < docs[j].urldata.length; i++) {

                            if (docs[j].urldata[i].visibility == "Public") {

                                console.log("Match Found..!!!");

                                var myresult = {


                                   
                                    walldata: docs[j].urldata[i].actualdata,


                                };

                                wallresults.push(myresult);

                            }

                        }


                    }

                    var userProfile = {

                        first: user.first,
                        last: user.last,
                        wallresult: wallresults,
                        username: user.username
                    };

                    res.send(userProfile);

                }
                else {
                    console.log("Error in showing userprofile data:" + error);
                    console.log("***********************************************************************************");

                }


            });

        }
        else {

            
            console.log("Error in fetching user data:" + error);
            console.log("***********************************************************************************");

        }


    });

});









//--------------------------------------------------------------------------------------------------------------

app.get('/sharedData', function (req, res) {

    wallresults = [];
    //console.log("in server shared");
    UserUrlDataModel.find(function (error, docs) {
        if (docs) {

            for (j = 0; j < docs.length; j++) {

                for (i = 0 ; i < docs[j].urldata.length; i++) {

                    if (docs[j].urldata[i].visibility == "Public") {

                        var myresult = {

                            username: docs[j].username,
                            walldata: docs[j].urldata[i].actualdata,
                            

                        };

                        wallresults.push(myresult);

                    }

                }


            }

            
            res.send(wallresults);
           
        }
        else {
            console.log("Error form sharing data in UserUrlDataModel:" + error);
            console.log("***********************************************************************************");

        }


    });


});




//--------------------------------------------------------------------------------------------------------------



app.post('/share', function (req, res) {

    console.log(req.body.username + "-------------------------------------------------------  " + req.body.urlname);

    UserUrlDataModel.findOne({ username: req.body.username, urlname: req.body.urlname }, function (error, doc) {


        if (doc) {

            for (var i = 0; i < doc.urldata.length; i++) {

                if(doc.urldata[i].actualdata == req.body.actualdata)
                {
                    console.log("Match found--------------------------------");
                    console.log("visi   " + doc.urldata[i].visibility);
                    if (doc.urldata[i].visibility == 'Private')
                    {

                        console.log("setting visbility to public");
                        doc.urldata[i].visibility = 'Public';
                        
                    }
                    else
                    {
                        doc.urldata[i].visibility = 'Private';
                       
                    }
                }
            }
            doc.save();

            //console.log("Match found");
            res.json(doc);

        }
        else {

            console.log("Error form changing the visibility in sharing data UserUrlDataModel:" + error);
            console.log("***********************************************************************************");


        }


    });

});


app.post('/opendata', function (req, res) {

    console.log(req.body.username + "  " + req.body.urlname);

    UserUrlDataModel.findOne({ username: req.body.username, urlname: req.body.urlname }, function (error, doc) {


        if (doc) {


            //console.log("Match found");
            res.json(doc);

        }
        else {

            console.log("Error form updatin the urlname the user wants data in UserUrlDataModel:" + error);
            console.log("***********************************************************************************");


        }


    });

});



app.post('/updateData', function (req, res) {

    console.log("Username in sever  " + req.body.username);
    console.log("urlname in sever  " + req.body.urlname);
    console.log("actualurl in sever  " + req.body.actualurl);
    console.log("old in sever  " + req.body.urlnameOld);


    


   

    UserScrapeDataModel.findOne({ username: req.body.username }, function (error, user)

    {

        console.log("i m here");

        if (user) {

            console.log("---------------------------------------------- user found"+user);
          //  console.log(user);
            for (var i = 0; i < user.listofurls.length; i++)
            {
                console.log(user.listofurls[i].urlname);
                if(user.listofurls[i].urlname == req.body.urlnameOld)
                {

                    
                    user.listofurls[i].urlname = req.body.urlname;

                }
            }
            user.save();


            UserUrlDataModel.findOne({ username: req.body.username, urlname: req.body.urlnameOld }, function (error, doc) {


                if (doc) {


                    console.log("Match found");
                    doc.urlname = req.body.urlname;

                    doc.save();

                }
                else {

                    console.log("Error form updatin the urlname the user wants data in UserUrlDataModel:" + error);
                    console.log("***********************************************************************************");


                }
                

            });

            


            res.send(user.listofurls);

        }
        else {
            console.log("Error form updatin the urlname the user wants data in UserScrapeDataModel:" + error);
            console.log("------------------------------------------------------,.--------nooooo");

        }

    });



});




app.post('/checkname', function (req, res) {


    //console.log("User name    " + req.body.username);

    var urlname = req.body.urlname;
    var username = req.body.username;
    console.log("server urlname check and user   " + urlname +"   " + username);
   
    UserScrapeDataModel.findOne({ username: username, listofurls: {urlname: urlname} }, function (err, user) {
        if (user) {
            console.log("User query  " + user);
            console.log("Error query  " + err);

            res.send("1");
            //return done(null, false, { message: 'User already exists' });
            }
        else {

            
            res.send("0");
            //res.send(user);
            //return done(null, user);
        }


    });

});




//------

app.post('/check', function (req, res) {


    //console.log(req.body.username);
    var username = req.body.username;
    console.log("server username check  " + username);
    var password = req.body.password;
    var first = req.body.first;
    var last = req.body.last;
    var email = req.body.email;
    console.log(" server check     pswd  " + password + "fist last email  " + first + "   " + last + "  " + email);

    UserModel.findOne({ username: username }, function (err, user) {
        if (user) {
            console.log("found user   " + user);
            res.send("1");
            //return done(null, false, { message: 'User already exists' });


        }
        else {

            console.log(" user not found");
            console.log("when user is not found   " + user);
            res.send("0");
            //res.send(user);
            //return done(null, user);
        }


    });

});





app.post('/register', function (req, res) {
    //var newUser = new UserModel(req.body);
    var username = req.body.username;
    console.log("server register username  " + username);
    var password = req.body.password;
    var first = req.body.first;
    var last = req.body.last;
    var email = req.body.email;
    console.log("server register     pswd  " + password + "fist last email  " + first + "   " + last + "  " + email);

    var newUser = new UserModel({
        username: username,
        password: password,
        first: first,
        last: last,
        email: email
    })
    console.log(newUser);
    newUser.save(function (err, user) {

        req.login(user, function (err) {

            if (err) {
                return next(err);
            }
            res.json(user);
        });

    });

});



app.post('/api/scrap', function (req, res) {
    //console.log(" started");
    name = req.body.name;
    var link = req.body.link;
    var choice = req.body.choice;
    console.log("The choice of user displayed in the server    " + choice);
    //console.log("server from " + name);
    /*
    request('http://www.google.com', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body) // Show the HTML for the Google homepage. 
        }
    })
    */
    var parsedResults = [];

    request({
        url: link,
    }, function (error, response, html) {
        //console.log("from request fun in server " + link);
        var $ = cheerio.load(html);

        if (choice == 'p' || choice == 'div') {
            $(choice).each(function () {

                var data = $(this).text();
                data = data.trim();
                if (data.length != 0)
                {
                    //console.log(data);
                    var jsonData = {

                        dataUrl: link,
                        tagData: data,
                        index: parsedResults.length,
                        tagtype: choice
                    };



                    parsedResults.push(jsonData);


                }

                
            });
        }


        //else {

        //    $('p', 'div').each(function () {

        //        var data = $(this).text();

        //        //console.log(data);
        //        var jsonData = {

        //            dataUrl: link,
        //            tagData: data,
        //            index: 
        //        };



        //        parsedResults.push(jsonData);
        //    });
        //}

        res.send(parsedResults);

    });

});


var likedData = [];  // user's saved data for that URL





//var UserDataSchema = new mongoose.Schema({
//    userName: String,
//    savedData: Array

//}, { collection: "UserData" });


//var UserData = mongoose.model("UserData", UserDataSchema);


//app.post('/api/save', auth, function (req, res) {
//    //console.log(req.body.d);

//    var d1 = new UserData({ userName: 'Meera', savedData: req.body.d });
//    d1.save(function () {
//        UserData.find(function (err, docs) {
//            if (err != null)
//            { res.send('/failure'); }
//            else
//            {
//                console.log('saved');
//                res.send('/done');
//            }

//        });

//    });


//});




//------------try in new schema------------------



app.post('/api/save', auth, function (req, res) {
    console.log("datum   "+ req.body.d);
    console.log("datum length  "+ req.body.d.length);
    console.log("url    " + req.body.actualurl);
    console.log("url link name     "+ req.body.urlname);
    console.log("user   "+ req.body.username);
   
    var savedata = 0;

    console.log("*******************************   " + savedata + "******************");
    

    for (var j = 0 ; j < req.body.d.length; j++) {
        console.log("tag data       " + req.body.d[j].tagData);
        console.log("index    "+ req.body.d[j].index);
    
        console.log("Dataum url array in server     " + req.body.d[j].dataUrl);
        console.log("Dataum data array in server     " + req.body.d[j].tagData);
        console.log("Dataum index array in server     " + req.body.d[j].index);
        console.log("Dataum tagtype array in server     " + req.body.d[j].tagtype);
        console.log("--------------------------------------------------------------");

    }

    UserScrapeDataModel.findOne({ username: req.body.username }, function (err, doc) {
        if (doc) {
            console.log("found user in new schema  " + doc);
            console.log("--------------------------------------------------------------");

            var c = 0;
            for (var i = 0; i < doc.listofurls.length; i++){
                if (doc.listofurls[i].urlname == req.body.urlname)
                {
                    console.log("found the url also");
                    console.log("--------------------------------------------------------------");

                    //savedata = 1;
                    c = 1;
                }
                //else /// work here and in the for loop to check the url name etc
            }

            if(c == 0)  // if c = 1...user found with that url so don't push new enter... and do not update the list of urls
            {
               // savedata = 1;
                console.log("did not find the url");
                console.log("--------------------------------------------------------------");

              //  var da = new UserScrapeDataModel;
                //da.username = req.body.username;
               // da.update({ username: doc.username }, { $push: { listofurls: { $each: [{ urlname: req.body.urlname, actualurl: req.body.actualurl }] } } }, function (error, doc) {



                var item = {
                        urlname: req.body.urlname,
                        actualurl: req.body.actualurl
                    };

                    // find by document id and update
                    UserScrapeDataModel.findByIdAndUpdate(
                        doc._id,
                        { $push: { listofurls: item } },
                        { safe: true, upsert: true }, function (error, doc) {





                    if (error) {
                        console.log("Error form inserting data in UserScrapeDataModel:" + error);
                        console.log("--------------------------------------------------------------");

                        //res.send('/failure');
                    }
                    else {
                        console.log("Done updating UserScrapeDataModel");
                        savedata = 1;
                        console.log("doc returned after updating   " + doc);
                        console.log("--------------------------------------------------------------");





                        var urldataarray = [];
                        console.log("*******************************   " + savedata + "******************");
                        if (savedata == 1) {
                            var d1 = new UserUrlDataModel;
                            d1.username = req.body.username;
                            d1.urlname = req.body.urlname;
                            d1.actualurl = req.body.actualurl;
                            if (d1.length = 0)
                            {
                                d1.tagtype = null;
                            }
                            else if(d1.length >= 1){
                                d1.tagtype = req.body.d[1].tagtype;
                            }
                            

                            for (var j = 0 ; j < req.body.d.length; j++) {
                                var urldataitem =
                                    {
                                        actualdata: req.body.d[j].tagData,
                                        index: req.body.d[j].index,
                                        visibility: 'Private'
                                    };
                                console.log("item   " + urldataitem);
                                urldataarray.push(urldataitem);
                                console.log("array   "+ urldataarray);
                            }

                            d1.urldata = urldataarray;
                            d1.save(function (error, data) {
                                if (error) {
                                    console.log("--------------------------------------------------------------");
                                    console.log("Error form saving new data entry for user url info in UserUrlDataModel savedata = 1 :" + error);
                                    res.send('/failure');
                                }
                                else {
                                    console.log("--------------------------------------------------------------");
                                    console.log("saved entry for user url info in UserUrlDataModel savedata = 1");
                                    res.send('/done');
                                }
                            });


                        }
                        else {

                            console.log("--------------------------------------------------------------");
                            console.log("Error form saving new data entry for user url info in UserUrlDataModel due to savedata is 0 :");
                            res.send('/failure');
                        }




                        //res.send('/done'); // respond with that user's list username and list of url's 
                    }

                });
                //da.listofurls = [{ urlname: req.body.urlname, url: req.body.url }];
                
               

            }
            else {
                console.log("found the url for that user in UserScrapeDataModel");
                console.log("--------------------------------------------------------------");

                //res.send('/done');
            }
            



        }
        else {
            console.log("did not find the user");
            console.log("--------------------------------------------------------------");

            var da = new UserScrapeDataModel;
            da.username = req.body.username;
            da.listofurls = [{ urlname: req.body.urlname, actualurl: req.body.actualurl }];
            da.save(function (error, data) {
                if(error){
                    console.log("Error form creating new data :" + error);
                    console.log("--------------------------------------------------------------");

                    //res.send('/failure');
                }
                else {
                    savedata = 1;
                    console.log("saved new entry for user in UserScrapeDataModel");
                    console.log("--------------------------------------------------------------");

                    // res.send('/done'); // respond with that user's list username and list of url's 








                    var urldataarray = [];
                    console.log("*******************************   " + savedata + "******************");
                    if (savedata == 1) {
                        var d1 = new UserUrlDataModel;
                        d1.username = req.body.username;
                        d1.urlname = req.body.urlname;
                        d1.actualurl = req.body.actualurl;
                        if (d1.length = 0) {
                            d1.tagtype = null;
                        }
                        else if (d1.length >= 1) {
                            d1.tagtype = req.body.d[1].tagtype;
                        }

                        for (var j = 0 ; j < req.body.d.length; j++) {
                            var urldataitem =
                                {
                                    actualdata: req.body.d[j].tagData,
                                    index: req.body.d[j].index,
                                    visibility: 'Private'
                                };
                            console.log("item   "+ urldataitem);
                            urldataarray.push(urldataitem);
                            console.log("array   " + urldataarray);

                        }
                        d1.urldata = urldataarray;
                        d1.save(function (error, data) {
                            if (error) {
                                console.log("--------------------------------------------------------------");
                                console.log("Error form saving new data entry for user url info in UserUrlDataModel savedata = 1 :" + error);
                                res.send('/failure');
                            }
                            else {
                                console.log("--------------------------------------------------------------");
                                console.log("saved entry for user url info in UserUrlDataModel savedata = 1");
                                res.send('/done');
                            }
                        });


                    }
                    else {

                        console.log("--------------------------------------------------------------");
                        console.log("Error form saving new data entry for user url info in UserUrlDataModel due to savedata is 0 :");
                        res.send('/failure');
                    }








                }
            });
            //console.log(" user not found");
            //console.log("when user is not found   " + user);
            //res.send("0");  // user is not found 
            //res.send(user);
            //return done(null, user);
        }






      













    });

  
   









});

    //---
     
  /*  var d1 = new UserScrapeData({ use, savedData: req.body.d });
    d1.save(function () {
        UserScrapeData.find(function (err, docs) {
            if (err != null)
            { res.send('/failure'); }
            else
            {
                console.log('saved');
                res.send('/done');
            }

        });

    });

    // */


    //--------------------------------------------


    // just commented 



//--------------try end--------------------------


passport.use(new LocalStrategy(
    function (username, password, done) {

        UserModel.findOne({ username: username, password: password }, function (err, user) {
            if (user) {
                return done(null, user);

            }
            return done(null, false, { message: 'Unable to login' });

        });

        //for (var u in users) {
        //    if (username == users[u].username && password == users[u].password) {
        //        return done(null, users[u]);
        //    }

        //}
    }
        ));


passport.serializeUser(function (user, done) {  // to encrypt
    done(null, user);

});

passport.deserializeUser(function (user, done) {  // to decrypt
    done(null, user);

});




app.post('/login', passport.authenticate('local'), function (req, res) {

    var user = req.body;
    //console.log("cookies:  " + req.cookies);
    res.json(user);
});



app.post('/api/userdata', auth, function (req, res) {
    //console.log(req.body.d);
    console.log("in server userdata")
    var userdata = UserData.find({ userName: 'ABC' }, 'savedData.dataUrl', function (err, docs) {
        console.log(docs);
        res.json(docs);
    });



});



app.post('/logout', function (req, res) {

    req.logout();
    res.send(200);
});







/*     // SIR'S EXAMPLE: 

app.get('/api/form', function (req, res) {
    Form.find(function (err, data) {
        res.json(data);
    });
});

app.get('/api/form/:id', function (req, res) {
    Form.findById(req.params.id, function (err, data) {
        res.json(data);

    });
});
*/

//-----



app.post('/api/data', function (req, res) {
    var like = req.body.sdata;

    likedData.push(like);

});





var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

app.listen(port, ip);