!function(){"use strict";root.define("atomic.html.eventsSet", function eventsSet(pubSub, each)
{
    function listenerList(target, eventNames, withCapture, intermediary)
    {
        Object.defineProperties(this,
        {
            "__eventNames":     {value: eventNames},
            "__target":         {value: target},
            "__withCapture":    {value: withCapture},
            "__intermediary":   {value: intermediary&&intermediary.bind(this)},
            pubSub:             {value: new pubSub((this.__listenersChanged).bind(this))}
        });
    }
    Object.defineProperties(listenerList.prototype,
    {
        "__listenersChanged":   {value: function(listenerCount)
        {
            for(var eventCounter=0,eventName;(eventName=this.__eventNames[eventCounter]) !== undefined;eventCounter++)
            if (listenerCount > 0 && !this.__isAttached)
            {
                this.__target.__element.addEventListener(eventName, this.__intermediary||this.pubSub, this.__withCapture);
                Object.defineProperty(this, "__isAttached", {value: true, configurable: true});
            }
            else    if(listenerCount == 0 && this.__isAttached)
            {
                this.__target.__element.removeEventListener(eventName, this.__intermediary||this.pubSub, this.__withCapture);
                Object.defineProperty(this, "__isAttached", {value: false, configurable: true});
            }
        }},
        destroy:
        {value: function()
        {debugger;
            for(var eventCounter=0,eventName;(eventName=this.__eventNames[eventCounter]) !== undefined;eventCounter++)  this.__target.__element.removeEventListener(eventName, this.__intermediary||this.pubSub, this.__withCapture);
            this.pubSub.destroy();
            each
            ([
                "pubSub",
                "__target"
            ],
            (function(name)
            {
                Object.defineProperty(this, name, {value: null, configurable: true});
                delete this[name];
            }).bind(this));
        }}
    });
    function eventsSet(target, intermediaries)
    {
        Object.defineProperties(this,
        {
            "__target":                     {value: target, configurable: true}, 
            "__listenersUsingCapture":      {value:{}, configurable: true}, 
            "__listenersNotUsingCapture":   {value:{}, configurable: true},
            "__intermediaries":             {value: intermediaries||{}, configurable: true}
        });
    }
    function getListener(name, withCapture, add)
    {
        var listeners       = withCapture ? this.__listenersUsingCapture : this.__listenersNotUsingCapture;
        var eventListeners  = listeners[name];
        var intermediary    = this.__intermediaries[name];
        if (add && eventListeners === undefined)    Object.defineProperty(listeners, name, {value: eventListeners=new listenerList(this.__target, intermediary ? intermediary.eventNames : [name], withCapture, intermediary&&intermediary.handler)});
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
                "__listenersUsingCapture",
                "__listenersNotUsingCapture"
            ],
            (function(listener)
            {
                each
                (this[listener],
                (function(name)
                {
                    this[listener][name].destroy();
                    Object.defineProperty(this[listener], name, {value: null, configurable: true});
                    delete this[listener][name];
                }).bind(this));
            }).bind(this));

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