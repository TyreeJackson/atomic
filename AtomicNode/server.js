var http            = require("http");
var atomicRouter    = require("./atomic/scripts/router.js")(http, require("url"), require("fs"));
var router          = new atomicRouter(null, 8888, "www");
router.rescue(function(request, response){response.write("WTF!");response.end();});
router.launch();