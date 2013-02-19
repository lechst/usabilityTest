//Core modules

var http = require('http');
var querystring = require('querystring');
var util = require('util');
var fs = require('fs');
var path = require('path');

//Non-core modules

var nodemailer = require('nodemailer');

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "usabilityTest.user13@gmail.com",
        pass: "John13Doe"
    }
});

var signForm = fs.readFileSync('../sign.html');
var logSite = fs.readFileSync('../logged.html');
var logScript = fs.readFileSync('logged.js');

var user = {};

http.createServer(function (request, response) {

    //Fulfilling the form

    if (request.method === "POST") {

        var postData = '';

        request.on('data', function (chunk) {

            postData += chunk;

        }).on('end', function () {

            var postDataObject = querystring.parse(postData);
            user = postDataObject;

            if (postDataObject.userUp && postDataObject.passUp && postDataObject.emailUp){

                var mailOptions = {
                    from: "John Doe <usabilityTest.user13@gmail.com>",
                    to: ""+postDataObject.emailUp,
                    subject: "Signing up to USABILITY TEST",
                    html: "<b>USABILITY TEST</b><p>This is your activation link:</p><a href='http://localhost:8080/activate'>Activate your account and sign in</a>",
                    createTextFromHtml: true
                }

                smtpTransport.sendMail(mailOptions, function(error, response){
                    if(error){
                        console.log(error);
                    }else{
                        console.log("Message sent: " + response.message);
                    }

                    smtpTransport.close();
                });

                console.log('User ' + postDataObject.userUp + ' created:\n', postData);
                response.end('User ' + postDataObject.userUp + ':\n' + 'Please check your mail-box, activate your account, and sign in.');

            } else if (postDataObject.userIn){

                var options = {

                    hostname: '127.0.0.1',
                    port: 5984,
                    path: '/_session',
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'}
                };

                var req = http.request(options, function(res){
                    var responseBody = "";

                    res.on("data", function(chunk) {
                        responseBody += chunk;
                    });

                    res.on("end", function() {

                        var responseBodyObject = JSON.parse(responseBody);

                        if(responseBodyObject.ok) {

                            console.log('User ' + postDataObject.userIn + ' has successfully signed in!\n');

                            response.writeHead(200, {'Content-Type': 'text/html'});
                            response.end(logSite);

                        } else if(responseBodyObject.error) {

                            response.writeHead(200, {'Content-Type': 'text/plain'});
                            response.write(responseBody);
                            response.end();

                            console.log('User ' + postDataObject.userIn + ' has not signed in!\n');

                        } else {

                            response.writeHead(200, {'Content-Type': 'text/plain'});
                            response.write('Something is wrong');
                            response.end();

                            console.log('Something is wrong');

                        }

                    });
                });

                req.write('{"name":"'+postDataObject.userIn+'", "password":"'+postDataObject.passIn+'"}');
                req.end();

                console.log('User ' + postDataObject.userIn + ' has posted:\n', postData);

            } else if (postDataObject.emailIn) {

                console.log('TODO: Password reminder');
                response.end('TODO: Password reminder');

            } else if (path.basename(request.url) == 'logout') {

                console.log('User has logged out!');
                response.writeHead(200, {'Content-Type': 'text/plain'});
                response.end('You have logged out. Please visit us later.');

            } else {

                console.log('Something is wrong');
                response.end('Something is wrong');

            }

        });

    }

    if (request.method === "GET") {

        if (path.basename(request.url) == 'logged.js') {

            response.writeHead(200, {'Content-Type': 'application/javascript'});
            response.end(logScript);

        } else if (path.basename(request.url) == 'activate') {

            //Creating user

            var options = {
                hostname: '127.0.0.1',
                port: 5984,
                path: '/_users',
                method: 'POST',
                headers: {'Content-Type': 'application/json'}
            };

            var req = http.request(options, function(res){
                var responseBody = "";

                res.on("data", function(chunk) {
                    responseBody += chunk;
                });

                res.on("end", function() {
                    response.writeHead(200, {'Content-Type': 'text/plain'});
                    response.write(responseBody);
                    response.end();
                });
            });

            req.write('{"_id":"org.couchdb.user:'+user.userUp+'", "password":"'+user.passUp
                +'" , "name":"'+user.userUp+'", "type": "user", "roles":[], "email":"'+user.emailUp
                +'"}'
            );
            req.end();

            //Creating database

            var options = {
                hostname: '127.0.0.1',
                port: 5984,
                path: '/'+user.userUp,
                method: 'PUT'
            };

            var req = http.request(options,function(res){
                res.on("end", function() {
                    response.writeHead(200, {'Content-Type': 'text/plain'});
                    response.write("Creating database finished");
                    response.end();
                });
            });
            req.end();

            //Updating the security document

            var options = {
                hostname: '127.0.0.1',
                port: 5984,
                path: '/'+user.userUp+'/_security',
                method: 'PUT',
                headers: {'Content-Type': 'application/json'}
            };

            var req = http.request(options,function(res){
                var responseBody = "";

                res.on("data", function(chunk) {
                    responseBody += chunk;
                });

                res.on("end", function() {
                    response.writeHead(200, {'Content-Type': 'text/plain'});
                    response.write(responseBody);
                    response.end();
                });
            });
            req.write('{"admins":{"names":[],"roles":[]}, "members":{"names":["'+user.userUp+'"],"roles":[]}}');
            req.end();

            console.log('User: '+user.userUp+' has successfully activated account.');

            response.writeHead(200, {'Content-Type': 'text/html'});
            response.end(signForm);

        } else if (path.basename(request.url) == 'getdata') {

            response.writeHead(200, {'Content-Type': 'text/plain'});
            response.write('User ' + user.userIn + ' has successfully signed in!');
            response.end();

        } else {

            response.writeHead(200, {'Content-Type': 'text/html'});
            response.end(signForm);

        }

    }

    //Reading database

    /*var options = {
        hostname: '127.0.0.1',
        port: 5984,
        path: '/test/_all_docs'
    };

    var req = http.get(options, function(res){
        var responseBody = "";

        res.on("data", function(chunk) {
            responseBody += chunk;
        });

        res.on("end", function() {
            response.writeHead(200, {'Content-Type': 'text/plain'});
            response.write(responseBody);
            response.end();
        });
    });*/

}).listen(8080);
