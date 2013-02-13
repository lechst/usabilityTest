var http = require('http');
var querystring = require('querystring');
var util = require('util');
var fs = require('fs');
var path = require('path');

var signForm = fs.readFileSync('../sign.html');
var logSite = fs.readFileSync('../logged.html');
var logScript = fs.readFileSync('logged.js');

http.createServer(function (request, response) {

    //Fulfilling the form

    if (request.method === "POST") {

        var postData = '';

        request.on('data', function (chunk) {

            postData += chunk;

        }).on('end', function () {

            var postDataObject = querystring.parse(postData);

            if (postDataObject.userUp){

                var options = {

                    hostname: '127.0.0.1',
                    port: 5984,
                    path: '/_users',
                    method: 'POST',
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

                req.write('{"_id":"org.couchdb.user:'+postDataObject.userUp+'", "password":"'+postDataObject.passUp
                    +'" , "name":"'+postDataObject.userUp+'", "type": "user", "roles":[], "email":"'+postDataObject.emailUp
                    +'"}');
                req.end();

                console.log('User ' + postDataObject.userUp + ' created:\n', postData);
                response.end('User ' + postDataObject.userUp + ' created:\n' + util.inspect(postDataObject));

            } else if (postDataObject.userIn){

                var options = {

                    hostname: '127.0.0.1',
                    port: 5984,
                    path: '/_session',
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'}
                };

                var req = http.request(options,function(res){
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

            } else {

                console.log('Something is wrong');
                response.end('Something is wrong');

            }

        });

    }

    if (request.method === "GET") {

        if(path.basename(request.url) == 'logged.js'){
            response.writeHead(200, {'Content-Type': 'application/javascript'});
            response.end(logScript);
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

    //Creating database

    /*var options = {
        hostname: '127.0.0.1',
        port: 5984,
        path: '/utdb002',
        method: 'PUT'
    };

    var req = http.request(options,function(res){
        res.on("end", function() {
            response.writeHead(200, {'Content-Type': 'text/plain'});
            response.write("Creating database finished");
            response.end();
        });
    });
    req.end();*/

    //Updating the security document

    /*var options = {
        hostname: '127.0.0.1',
        port: 5984,
        path: '/utdb002/_security',
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
    req.write('{"admins":{"names":[],"roles":[]}, "members":{"names":["jan"],"roles":[]}}');
    req.end();*/

    //Creating the user

    /*var options = {
        hostname: '127.0.0.1',
        port: 5984,
        path: '/_users',
        method: 'POST',
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
    req.write('{"_id":"org.couchdb.user:jan", "password":"123" , "name":"jan", "databases": ["utdb002"], "type": "user", "roles":[]}');
    req.end();*/

}).listen(8080);
