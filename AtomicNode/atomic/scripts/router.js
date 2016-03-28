module.exports  =
function atomic_router(http, urlParser, staticHandler, parameterParser)
{
    function notFound(request, response){response.statusCode=404;response.statusMessage="Path not found.";response.write("Path not found");response.end();};

    function BaseService(request, response){ Object.defineProperties(this, {request: {writable: false, value: request, enumerable: false, configurable: false}, response:{writable: false, value: response, enumerable: false, configurable: false}}); };
    BaseService.prototype.notFound  = function(){notFound(this.response, this.request);}
    
    function ServiceFactory(definition)
    {
        this.__definition       = definition;
        this.__class            = Function("var BaseService=arguments[0]; return function " + definition.name +"(request, response){BaseService.call(this, request, response);}")(BaseService);
        this.__class.prototype  = new BaseService();
        for (var methodKey in definition.methods)   this.__class.prototype[methodKey]   = definition.methods[methodKey];
    }
    ServiceFactory.prototype.create = function(request, response){ return new this.__class(request, response); }

    function invokeServiceMethod(methodName)
    {
        // todo: rehydrate parameters for the method and call the method with them
        parameterParser(this.request, (function(requestArguments)
        {
            Object.defineProperty(this, "arguments", {writable: false, value: requestArguments, enumerable: false, configurable: false});
            var result      = this[methodName]();
            if (result !== undefined)
            {
                this.response.writeHead(200, {"Content-Type": "application/json"});
                this.response.write(JSON.stringify(result));
                this.response.end();
            }
        }).bind(this));
    }
    function createServiceMethodHandler(factory, methodName) { return function(request, response){ invokeServiceMethod.call(factory.create(request, response), methodName); }; }
    function registerServiceMethods(serviceDefinition)
    {
        var serviceFactory  = new ServiceFactory(serviceDefinition);
        for(var methodKey in serviceDefinition.methods) this.__routes["/"+this.__servicesPath+"/"+serviceDefinition.name.toLowerCase()+"/"+methodKey.toLowerCase()]  = createServiceMethodHandler.call(this, serviceFactory, methodKey);
    }
    function registerServices(services)
    {
        for(var serviceCounter=0;serviceCounter<services.length;serviceCounter++)   registerServiceMethods.call(this, services[serviceCounter]);
    }
    function router(port, staticPath, servicesPath, services)
    {
        this.__routes       = {};
        this.__port         = port;
        this.__staticPath   = staticPath;
        this.__servicesPath = servicesPath.toLowerCase();
        registerServices.call(this, services);
    }
    router.prototype.rescue = function(callback){this.__rescue = callback;}
    router.prototype.launch =
    function()
    {
        http.createServer((function(request, response)
        {
            var url     = urlParser.parse(request.url);
            staticHandler(this.__staticPath + url.pathname, request, response, (function()
            {
                var handler = this.__routes[url.pathname.toLowerCase()]||this.__rescue||notFound;
                handler.call(this, request, response);
            }).bind(this));
        }).bind(this)).listen(this.__port);
    }
    return router;
}