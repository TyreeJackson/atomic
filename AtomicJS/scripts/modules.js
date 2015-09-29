(function(global)
{
    var modules         = {};
    var readyCallbacks  = [];

    function getDependencies(module, loadedModules)
    {
        var dependencies    = [];
        if (module.dependencies !== null)
        for(var dependencyCounter=0;dependencyCounter<module.dependencies.length;dependencyCounter++)
        {
            var dependencyName  = module.dependencies[dependencyCounter];
            if (loadedModules.indexOf(dependencyName) > -1) throw new Error("Circular dependency encountered between " + module.name + " and " + dependencyName + ".");
            dependencies.push(getModule(dependencyName, loadedModules));
        }
        return dependencies;    
    }

    function constructModule(module, loadedModules)
    {
        var instance        = new (module.factory.bind.apply(module.factory, getDependencies(module, [moduleName].concat(loadedModules))))();
        if (module.singleton)   module.instance = instance;
        return instance;
    }

    function getModule(moduleName, loadedModules)
    {
        var module      = modules[moduleName];
        if (module === undefined)   throw new Error("Module with name " + moduleName + " was not found. Did you remember to load it?");
        if (module.instance !== undefined)  return module.instance;
        return constructModule(module, loadedModules);
    }

    global.modules  =
    {
        /*
        usage:
        modules.define
        (
            [isSingleton:bool],             // boolean indicating whether or not there should only be one instance of the module constructed
            moduleName:string,              // name of the module being defined
            [dependencies:array[:string]],  // array of names of registered dependencies to inject into the module when it is constructed
            factory:function                // function containing the module to construct
        );
        */
        define:
        function(singleton, moduleName, dependencies, factory)
        {
            if (singleton !== true && singleton !== false)
            {
                factory         = dependencies;
                dependencies    = moduleName;
                moduleName      = singleton;
                singleton       = false;
            }
            if (module === undefined)
            {
                factory         = dependencies;
                dependencies    = null;
            }
            modules[moduleName] = {name: moduleName, singleton: singleton, dependencies: dependencies, factory: factory};
        },
        /*
        usage:
        modules.get
        (
            moduleName:string   // name of the module to return
        );
        */
        get:    function(moduleName) { return getModule(moduleName, []); },
        /*
        usage:
        modules.ready
        (
            callback:function   // callback to executing when the global environment has fully loaded
        );
        */
        ready:
        function(callback)
        {
            readyCallbacks.push(callback);
        }
    }

    global.addEventListener("load", function(){ for(var callbackCounter=0;callbackCounter<readyCallbacks.length;callbackCounter++)  readyCallbacks[callbackCounter](); }, false);
})(window);