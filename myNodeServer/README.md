# 代码和用法进行介绍
```
var http = require('http');
//获得http属性
var fs = require('fs')
//获得fs属性
http.createServer(function(req, res){
    //创建服务器，参数为请求req和相应res
    switch(req.url){
        //不同请求下处理路由的方式
        case '/sample/time':
            res.end( fs.readFileSync(__dirname + '/sample/test.HTML'));
            break;
        //当请求为/sample/time十打开相应页面
        case '/getCity':
            res.end(JSON.stringify({'city':'guiyang', 'province': 'guizhou'}));
            break;
        //当请求为/get十打开相应页面
        default:
            res.end(fs.readFileSync(__dirname + "/welcomePage.HTML"))
        //其他情况
    }

}).listen(8080);
//启动服务器并且监听
console.log('visit http://localhost:8080' );
```