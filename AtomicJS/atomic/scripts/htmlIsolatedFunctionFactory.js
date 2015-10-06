!function()
{"use strict";root.define("atomic.isolatedFunctionFactory",
function isolatedFunctionFactory(document)
{
    return function(functionToIsolate)
    {
        var iframe              = document.createElement("iframe");
        iframe.style.display    = "none";
        document.body.appendChild(iframe);
        frames[frames.length - 1].document.write("<script>parent.__isolatedFunction = " + functionToIsolate.toString() + "; parent.__isolatedFunction.__prototype=Function.prototype;<\/script>");
        var __isolatedFunction  = window.__isolatedFunction;
        delete window.__isolatedFunction;
        document.body.removeChild(iframe);
        return __isolatedFunction;
    };
});}();