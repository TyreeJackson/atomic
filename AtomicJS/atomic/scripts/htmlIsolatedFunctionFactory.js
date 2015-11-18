!function()
{"use strict";root.define("atomic.isolatedFunctionFactory",
function isolatedFunctionFactory(document)
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
            function(functionToIsolate)
            {
                isolatedDocument.write("<script>parent.__isolatedSubFunction = " + functionToIsolate.toString() + ";<\/script>");
                var __isolatedSubFunction  = window.__isolatedSubFunction;
                delete window.__isolatedSubFunction;
                return __isolatedSubFunction;
            },
            root:   isolatedFunction
        };
    }
});}();
