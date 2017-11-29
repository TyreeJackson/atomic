!function()
{"use strict";root.define("atomic.html.eventsSet", function eventsSet(pubSub, each)
{
    function listenerList(target, eventName, withCapture)
    {
        Object.defineProperties(this,
        {
            "__eventName":      {value: eventName},
            "__target":         {value: target},
            "__withCapture":    {value: withCapture},
            pubSub:             {value: new pubSub((this.__listenersChanged).bind(this))}
        });
    }
    Object.defineProperties(listenerList.prototype,
    {
        "__listenersChanged":   {value: function(listenerCount)
        {
            if (listenerCount > 0 && !this.__isAttached)
            {
                this.__target.__element.addEventListener(this.__eventName, this.pubSub, this.__withCapture);
                Object.defineProperty(this, "__isAttached", {value: true, configurable: true});
            }
            else    if(listenerCount == 0 && this.__isAttached)
            {
                this.__target.__element.removeEventListener(this.__eventName, this.pubSub, this.__withCapture);
                Object.defineProperty(this, "__isAttached", {value: false, configurable: true});
            }
        }}
    });
    function eventsSet(target)
    {
        Object.defineProperties(this,
        {
            "__target":                     {value: target, configurable: true}, 
            "__listenersUsingCapture":      {value:{}, configurable: true}, 
            "__listenersNotUsingCapture":   {value:{}, configurable: true}
        });
    }
    function getListener(name, withCapture, add)
    {
        var listeners       = withCapture ? this.__listenersUsingCapture : this.__listenersNotUsingCapture;
        var eventListeners  = listeners[name];
        if (add && eventListeners === undefined)    Object.defineProperty(listeners, name, {value: eventListeners=new listenerList(this.__target, name, withCapture)});
        return eventListeners&&eventListeners.pubSub;
    }
    Object.defineProperties(eventsSet.prototype,
    {
        getOrAdd:   {value: function(name, withCapture){ return getListener.call(this, name, withCapture, true); }},
        get:        {value: function(name, withCapture){ return getListener.call(this, name, withCapture, false); }},
        destroy:
        {value: function()
        {
            each
            ([
                "__target",
                "__listenersUsingCapture",
                "__listenersNotUsingCapture"
            ],
            (function(name)
            {
                Object.defineProperty(this, name, {value: null, configurable: true});
                delete this[name];
            }).bind(this));
        }}
    });
    return eventsSet;
});}();