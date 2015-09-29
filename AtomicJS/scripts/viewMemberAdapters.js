modules.define
(
    true,
    "viewMemberAdapters",
    ["global", "document"],
    function(global, document)
    {
        var bindSourceFunctions  =
        {
        };

        var valueFunctions  =
        {
        };

        return function(viewAdapter)
        {
            var listenersUsingCapture       = {};
            var listenersNotUsingCapture    = {};

            viewAdapter.addEventListener    = function(){};
            viewAdapter.appendView          = function(){};
            viewAdapter.bindSource          = bindSourceFunctions[viewAdapter.__element.nodeName.toLowerCase() + (viewAdapter.__element.type ? ":" + viewAdapter.__element.type.toLowerCase() : "")]||valueFunctions.default;;
            viewAdapter.bind                = function(){};
            viewAdapter.hide                = function(){};
            viewAdapter.hideFor             = function(milliseconds){};
            viewAdapter.removeView          = function(){};
            viewAdapter.removeListener      = function(){};
            viewAdapter.show                = function(){};
            viewAdapter.showFor             = function(milliseconds){};
            viewAdapter.value               = valueFunctions[viewAdapter.__element.nodeName.toLowerCase() + (viewAdapter.__element.type ? ":" + viewAdapter.__element.type.toLowerCase() : "")]||valueFunctions.default;
        }
    }
);