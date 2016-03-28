module.exports  =
function requestParameterParser(url)
{return function(request, callback)
{
    if (request.method === "GET")   callback(url.parse(request.url, true).query);
    else
    {
        var parameterData   = "";
        request.on('data', function (data) { parameterData += data; });
        request.on('end', function () { callback(JSON.parse(parameterData)); });
    }
};}