!function()
{"use strict";
    var head        = document.getElementsByTagName("head")[0];
    var scripts     = document.getElementsByTagName("script");
    var initScript  = getMainScriptElement()||"";
    function getMainScriptElement()
    {
        var initScript;
        for(var counter=0;counter<scripts.length;counter++) if (initScript = scripts[counter].getAttribute("data-init")) return initScript;
    }
    if (initScript.length > 0 && initScript.substr(initScript.length-3).toLowerCase() != ".js") initScript += ".js";
    function bouncer()
    {
        if (arguments.length < this.parameters.length)  throw new Error("Missing arguments for parameters: [" + this.parameters.slice(arguments.length).join(", ") + "]");
        return new Function.prototype.bind.apply(this.func, [null].concat(Array.prototype.slice.call(arguments)));
    }

    var referenceCache  = {};
    var executorList    = [];
    function defineReference(linkName, link){ return referenceCache[link]||{name: linkName, url: link, types: {}, loaded: false}; }
    function defineReferences(links)
    {
        var references  = {};
        for(var linkName in links)  references[linkName] = defineReference(linkName, links[linkName]);
        return references;
    }
    function getReferenceByUrl(references, url)
    {
        for(var referenceName in references) if (references[referenceName].url == url) return references[referenceName];
    }
    function checkForAllLoaded(references){ for(var referenceName in references) if (!references[referenceName].loaded) return false; return true; }
    function getTypesFromReferences(references)
    {
        var typesByReference    = {};
        for(var referenceName in references)    typesByReference[referenceName] = references[referenceName].types;
        return typesByReference;
    }
    function __executor(links)
    {
        var references  = defineReferences(links);
        var executorCallback;
        function executor(callback){ executorCallback = callback; if (checkForAllLoaded(references)) executorCallback(getTypesFromReferences(references)); }
        function scriptsLoadComplete(script)
        {
            getReferenceByUrl(references, script.src).loaded    = true;
            if (executorCallback !== undefined && checkForAllLoaded(references)) executorCallback(getTypesFromReferences(references));
        }
        function loadScripts(completed)
        {
            for(var referenceName in references)    references[referenceName].url = loadScript.call(this, references[referenceName].url, completed);
        }
        function getNamespace(root, paths)
        {
            var current     = root;
            for(var pathCounter=0;pathCounter<paths.length-1;pathCounter++)
            {
                var path    = paths[pathCounter];
                if (current[path] === undefined)    current[path]   = {};
                current     = current[path];
            }
            return current;
        }
        function define(fullName, value)
        {
            var reference   = getReferenceByUrl(references, document.currentScript.src);
            var paths       = fullName.split(".");
            var nameSpace   = getNamespace(reference.types, paths);
            Object.defineProperty(nameSpace, paths[paths.length-1], {value: value, writable: false, enumerable: false, configurable: false});
            console.log("Defined " + fullName + " in reference " + reference.name + ".");
        }
        function defineClass(fullName, func)
        {
            var reference   = getReferenceByUrl(references, document.currentScript.src);
            var paths       = fullName.split(".");
            var nameSpace   = getNamespace(reference.types, paths);
            Object.defineProperty(nameSpace, paths[paths.length-1], {value: bouncer.bind({parameters: getParameterNames(func), func: func}), writable: false, enumerable: false, configurable: false});
            console.log("Defined " + fullName + " in reference " + reference.name + ".");
        }
        executorList.push(executor);
        Object.defineProperty(executor, "links", {get: function(){return links;}, enumerable: false});
        Object.defineProperty(executor, "id", {value: executorList.length - 1, enumerable: false, configurable: false, writable: false});
        Object.defineProperty(executor, "complete", { value: scriptsLoadComplete, enumerable: false, writable: false, configurable: false});
        Object.defineProperty(executor, "load", { value: loadScripts, enumerable: false, writable: false, configurable: false});
        Object.defineProperty(executor, "define", { value: define, enumerable: false, writable: false, configurable: false});
        Object.defineProperty(executor, "defineClass", { value: defineClass, enumerable: false, writable: false, configurable: false});
        return executor;
    }
    function loadScript(dependency, completed)
    {
        var script      = createScriptTag.call(this, dependency);
        head.appendChild(script);
        console.log("Fetching " + script.src + "...");
        return script.src;
    }
    function cleanupScriptElement(scriptElement)
    {
        scriptElement.removeEventListener("load", scriptLoaded, false);
        scriptElement.removeEventListener("error", scriptLoadFailed, false);
    }
    function scriptLoaded(loadEvent)
    {
        cleanupScriptElement(loadEvent.srcElement);
        var executorId  = loadEvent.srcElement.getAttribute("data-executor");
        executorList[executorId].complete(loadEvent.srcElement);
    }
    function scriptLoadFailed()
    {
        cleanupScriptElement(loadEvent.srcElement);
    }
    function createScriptTag(url)
    {
        var scriptElement       = document.createElement("script");
        scriptElement.type      = "text/javascript";
        scriptElement.async     = true;
        scriptElement.charset   = "utf-8";
        scriptElement.addEventListener("load", scriptLoaded, false);
        scriptElement.addEventListener("error", scriptLoadFailed, false);
        scriptElement.setAttribute("data-executor", this.id);
        scriptElement.src       = url;
        return scriptElement;
    }





    var matchComments       = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    var matchParameterNames = /([^\s,]+)/g;
    function getParameterNames(func)
    {
        var functionBody = func.toString().replace(matchComments, '');
        return functionBody.slice(functionBody.indexOf('(')+1, functionBody.indexOf(')')).match(matchParameterNames)||[];
    }




    function getExecutor() { return executorList[document.currentScript.getAttribute("data-executor")]; }
    function __imports(){}
    __imports.prototype.define = function(fullName, value){ getExecutor().define(fullName, value); }
    __imports.prototype.defineClass = function(fullName, func) { getExecutor().defineClass(fullName, func); }
    __imports.prototype.init   =
    function(links)
    {
        var executor    = new __executor(links);
        executor.load(function(scripts){ executor.complete(scripts); });
        return executor;
    }
    window.imports = window.imports || new __imports();
    if (initScript.length > 0) window.imports.init([initScript]);
}();