!function()
{"use strict";
    var __root              = new __namespace();
    function __namespace(){}
    __namespace.prototype.define    = function(fullName, item) { namespace(this, fullName, item); }
    function getNamespace(root, paths)
    {
        var current     = root;
        for(var pathCounter=0;pathCounter<paths.length-1;pathCounter++)
        {
            var path    = paths[pathCounter];
            if (current[path] === undefined)    current[path]   = new __namespace();
            current     = current[path];
        }
        return current;
    }
    function namespace(root, fullName, value)
    {
        var paths                           = fullName.split(".");
        var namespace                       = getNamespace(root, paths);
        if (value === undefined)            return namespace[paths[paths.length-1]];
        namespace[paths[paths.length-1]]    = value;
    }
    window.root = __root;
}();