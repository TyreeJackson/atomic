module.exports  =
function atomic_router(http, urlParser, fileSystem)
{
    function notFound(request, response){response.statusCode=404;response.statusMessage="Path not found.";response.write("Path not found");response.end();};
    function routeWWW(urlPath, request, response, next)
    {
        return fileSystem.readFile(urlPath, "utf8", function(error, data)
        {
            if (error || data===undefined)
            return fileSystem.readFile(urlPath+".html", "utf8", function(error2, data2)
            {
                if (error2 || data===undefined)
                return fileSystem.readFile(urlPath+"/index.html", "utf8", function(error3, data3)
                {
                    if (error3 || data===undefined) return next();
                    response.write(data);
                    response.end();
                    return;
                });
                response.write(data);
                response.end();
                return;
            });
            response.write(data);
            response.end();
            return;
        });
    }
    function router(routes, port, basePath)
    {
        this.__routes   = routes||{};
        this.__port     = port;
        this.__basePath = basePath;
    }
    router.prototype.rescue = function(callback){this.__rescue = callback;}
    router.prototype.launch =
    function()
    {
        http.createServer((function(request, response)
        {
            var url     = urlParser.parse(request.url);
            routeWWW.call(this, this.__basePath + "/" + url.path, request, response, (function()
            {
                var handler = this.__routes[url.path]||this.__rescue||notFound;
                handler.call(this, request, response);
            }).bind(this));
        }).bind(this)).listen(this.__port);
    }
    return router;
}