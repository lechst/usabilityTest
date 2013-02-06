var http = require('http');
var querystring = require('querystring');
var util = require('util');

var signForm = require('fs').readFileSync('../sign.html');

http.createServer(function (request, response) {

    if (request.method === "POST") {

        var postData = '';

        request.on('data', function (chunk) {

            postData += chunk;

        }).on('end', function () {

            var postDataObject = querystring.parse(postData);
            console.log('User ' + postDataObject.user + ' posted:\n', postData);
            response.end('User ' + postDataObject.user + ' posted:\n' + util.inspect(postDataObject));

        });

    }

    if (request.method === "GET") {

        response.writeHead(200, {'Content-Type': 'text/html'});
        response.end(signForm);

    }

}).listen(8080);
