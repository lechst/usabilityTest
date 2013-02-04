var http = require('http');
var fs = require('fs');

http.createServer(function(req,res){

    var filePath = '..' + req.url;

    if (filePath == '../'){
        filePath = '../sign.html';
    }

    fs.exists(filePath, function(exists) {

        if (exists) {
            fs.readFile(filePath, function(error, content) {
                if (error) {
                    res.writeHead(500);
                    res.end();
                }
                else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(content, 'utf-8');
                }
            });
        }
        else {
            res.writeHead(404);
            res.end();
        }

    });

}).listen(8080);
