!function()
{"use strict";root.define("atomic.html.isolatedFunctionFactory", function isolatedFunctionFactory(document)
{
    return function()
    {
        var iframe              = document.createElement("iframe");
        iframe.style.display    = "none";
        document.body.appendChild(iframe);
        var isolatedDocument    = frames[frames.length - 1].document;
        isolatedDocument.write("<script>parent.__isolatedFunction = Function;<\/script>");
        var isolatedFunction    = window.__isolatedFunction;
        delete window.__isolatedFunction;
 return {
            create:
            function(constructor)
            {
                //isolatedDocument.write("<script>parent.__isolatedSubFunction = " + functionToIsolate.toString() + ";<\/script>");
                isolatedDocument.write("<script>parent.__isolatedSubFunction = function "+constructor.name+"(){function "+constructor.name+"(){return "+constructor.name+".___invoke.apply("+constructor.name+", arguments);}; this.___construct.apply("+constructor.name+", arguments); return "+constructor.name+";};<\/script>");
                var __isolatedSubFunction  = window.__isolatedSubFunction;
                delete window.__isolatedSubFunction;
                __isolatedSubFunction.prototype.___construct = constructor;
                return __isolatedSubFunction;
            },
            root:   isolatedFunction
        };
    }
});}();