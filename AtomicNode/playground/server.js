var atomicRouter    = 
require("../atomic/scripts/router.js")
(
    require("http"),
    require("url"),
    require("../atomic/scripts/staticHandler.js")(require("fs")),
    require("../atomic/scripts/requestParameterParser.js")(require("url"))
);
var services        = 
[
    require("./api/userManagement.js"),
    require("./api/todoManagement.js")(require("monk"))
];
var router          = new atomicRouter(8888, "www", "api", services);
router.rescue(function(request, response){response.write("WTF!");response.end();});
router.launch();