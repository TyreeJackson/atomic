module.exports  =
function staticHandler(fileSystem)
{return function routeWWW(urlPath, request, response, next)
{
    return fileSystem.readFile(urlPath, "utf8", function(error, data)
    {
        if (urlPath.length >= 1 && urlPath.substring(urlPath.length-1) == "/")  urlPath = urlPath.substring(0, urlPath.length-1);
        if (urlPath === "/")                                                    urlPath = "";
        if (error || data===undefined)
        return fileSystem.readFile(urlPath+".html", "utf8", function(error2, data2)
        {
            if (error2 || data2===undefined)
            return fileSystem.readFile(urlPath+"/index.html", "utf8", function(error3, data3)
            {
                if (error3 || data3===undefined) return next();
                response.write(data3);
                response.end();
                return;
            });
            response.write(data2);
            response.end();
            return;
        });
        response.write(data);
        response.end();
        return;
    });
}}