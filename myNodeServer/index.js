var http = require('http');
var fs = require('fs')
http.createServer(function(req, res){
    switch(req.url){
        case '/sample/time':
            res.end( fs.readFileSync(__dirname + '/sample/test.HTML'));
            break;
        case '/getCity':
            res.end(JSON.stringify({'city':'guiyang', 'province': 'guizhou'}));
            break;
        default:
            res.end(fs.readFileSync(__dirname + "/welcomePage.HTML"))
    }

}).listen(8080);
console.log('visit http://localhost:8080' );