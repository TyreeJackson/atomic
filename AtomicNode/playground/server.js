var http            = require("http");
var atomicRouter    = require("../atomic/scripts/router.js")(http, require("url"), require("fs"));
var services        = 
[
    require("./api/userManagement.js"),
    require("./api/storyManagement.js")
];
var router          = new atomicRouter(8888, "www", "api", services);
router.rescue(function(request, response){response.write("WTF!");response.end();});
router.launch();