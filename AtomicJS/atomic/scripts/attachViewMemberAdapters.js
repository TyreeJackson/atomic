!function()
{
    var bindSourceFunctions  =
    {
        "default":
        function(sources)
        {
            for(var controlKey in this.controls)    this.controls[controlKey].bindSource(sources);
        }
    };

    var valueFunctions  =
    {
        "default":
        function(value)
        {
            if (value !== undefined)    this.__element.value    = value;
            else                        return this.__element.value;
        }
    };

    function addClass(element, className, removeItemFromArray)
    {
        var classNames  = element.className.split(" ");
        if (classNames.indexOf(className) === -1) classNames.push(className);
        element.className = classNames.join(" ");
    }
    function removeClass(element, className, removeItemFromArray)
    {
        var classNames  = element.className.split(" ");
        if (classNames.indexOf(className) > -1) removeItemFromArray(classNames, className);
        element.className = classNames.join(" ");
    }
    function createElementListener(listeners)
    {
        return function() { for(var listenerCounter=0;listenerCounter<listeners.listeners.length;listenerCounter++)   listeners.listeners[listenerCounter].apply(null, arguments); };
    }
    function addListener(viewAdapter, eventName, listeners, listener, withCapture)
    {
        if (listeners.elementListener === undefined)
        {
            listeners.elementListener   = createElementListener(listeners);
            viewAdapter.__element.addEventListener(eventName, listeners.elementListener, withCapture);
        }
        listeners.listeners.push(listener);
    }
    function removeListener(viewAdapter, eventName, listeners, listener, withCapture, removeItemFromArray)
    {
        if (listeners.elementListener !== undefined)
        {
            removeItemFromArray(listeners.listener, listener);
            if (listeners.listeners.length === 0)
            {
                viewAdapter.__element.removeEventListener(eventName, listeners.elementListener, withCapture);
                delete listeners.elementListener;
            }
            listeners.elementListener   = createElementListener(listeners);
            viewAdapter.__element.addEventListener(eventName, listeners.elementListener, withCapture);
        }
    }

    root.define
    (
        "atomic.attachViewMemberAdapters",
        function attachViewMemberAdapters(removeItemFromArray, setTimeout, clearTimeout)
        {
            return function(viewAdapter)
            {
                var listenersUsingCapture       = {listeners: []};
                var listenersNotUsingCapture    = {listeners: []};

                viewAdapter.addClass            = function(className){ addClass(viewAdapter, className, removeItemFromArray); }
                viewAdapter.addEventListener    = function(eventName, listener, withCapture){ addListener(viewAdapter, eventName, (withCapture?listenersUsingCapture:listenersNotUsingCapture), listener, withCapture); };
                viewAdapter.appendView          = function(childView){ this.__element.appendChild(childView.__element); };
                viewAdapter.bindSource          = bindSourceFunctions[viewAdapter.__element.nodeName.toLowerCase() + (viewAdapter.__element.type ? ":" + viewAdapter.__element.type.toLowerCase() : "")]||valueFunctions.default;;
                viewAdapter.bind                = function(){};
                viewAdapter.hide                = function(){ this.__element.style.display="none"; };
                viewAdapter.hideFor             = function(milliseconds){ this.hide(); setTimeout((function(){this.show();}).bind(this), milliseconds); };
                viewAdapter.removeClass         = function(className){ removeClass(viewAdapter, className, removeItemFromArray); }
                viewAdapter.removeView          = function(childView){ this.__element.removeChild(childView.__element); };
                viewAdapter.removeListener      = function(eventName, listener, withCapture){ addListener(viewAdapter, eventName, (withCapture?listenersUsingCapture:listenersNotUsingCapture), listener, withCapture); };
                viewAdapter.show                = function(){ this.__element.style.display=""; };
                viewAdapter.showFor             = function(milliseconds){ this.show(); setTimeout((function(){this.hide();}).bind(this), milliseconds); };
                viewAdapter.value               = valueFunctions[viewAdapter.__element.nodeName.toLowerCase() + (viewAdapter.__element.type ? ":" + viewAdapter.__element.type.toLowerCase() : "")]||valueFunctions.default;
            };
        }
    );
}();