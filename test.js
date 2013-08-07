var sys = require('sys');
var http = require('http');
var path = require('path');
var url = require('url');
var filesys = require('fs');

http.createServer(function(request, response) {
    var myPath = url.parse(request.url).pathname;
    sys.puts('myPath: ' + myPath);
    var fullPath = path.join(process.cwd(), myPath);
    sys.puts('fullPath: ' + fullPath);

    path.exists(fullPath, function (exists) {
        if (!exists) {
            response.writeHeader(404, {
                'Content-Type': 'text/plain'
            });
            response.write('404 Not Found\n');
            response.end();
        } else {
            filesys.readFile(fullPath, 'binary', function (err, file) {
                if (err) {
                    response.writeHeader(500, {
                        'Content-Type': 'text/plain'
                    });
                    response.write(err + '\n');
                    response.end();
                } else {
                    response.writeHeader(200);
                    response.write(file, 'binary');
                    response.end();
                }
            });
        }
    });
}).listen(8080);

sys.puts('Server running on 8080');
