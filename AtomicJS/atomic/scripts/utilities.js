!function()
{"use strict";
    root.define("utilities.each", function each(array, callback) { for(var arrayCounter=0;arrayCounter<array.length;arrayCounter++) callback(array[arrayCounter], arrayCounter); });
    root.define("utilities.removeFromArray", function removeFromArray(array, from, to)
    {
        var rest        = array.slice((to || from) + 1 || array.length);
        array.length    = from < 0 ? array.length + from : from;
        return array.push.apply(array, rest);
    });
    root.define("utilities.pubSub", function pubSub()
    {
        var listeners   = [];
        function _pubSub() { for(var listenerCounter=0;listenerCounter<listeners.length;listenerCounter++) listeners[listenerCounter].apply(null, arguments); }
        _pubSub.listen  = function(listener) { listeners.push(listener); }
        _pubSub.ignore  = function(listener) { root.utilities.removeFromArray.call(listeners, listener); }
        return _pubSub;
    });
    root.define("utilities.removeItemFromArray", function removeItemFromArray(array, item){ root.utilities.removeFromArray(array, array.indexOf(item)); });
}();