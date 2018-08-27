!function(){"use strict";root.define("atomic.html.input", function htmlInput(control)
{
    function cancelEvent(event)
    {
        event.preventDefault();
        event.stopPropagation();
        return false;
    }
    function notifyIfValueHasChanged(callback)
    {
        this.__lastChangingTimeout  = undefined;
        callback.call(this, this.__lastChangingValueSeen);
    }
    function notifyIfValueHasChangedOrDelay()
    {
        if ((this.__target.__lastChangingValueSeen||"") === this.__target.value())  return;
        this.__target.__lastChangingValueSeen = this.__target.value();
        if (this.__target.onchangingdelay !== undefined)
        {
            if (this.__target.__lastChangingTimeout !== undefined)   clearTimeout(this.__target.__lastChangingTimeout);
            this.__target.__lastChangingTimeout  = setTimeout(notifyIfValueHasChanged.bind(this.__target, this.pubSub), this.__target.onchangingdelay);
        }
        else    notifyIfValueHasChanged.call(this, callback);
    }
    function input(elements, selector, parent, bindPath, childKey, protoChildKey)
    {
        control.call(this, elements, selector, parent, bindPath, childKey, protoChildKey);
        this.__binder.defineDataProperties(this,
        {
            value:          {get: function(){return this.__element.value;},         set: function(value){this.__element.value = value||""; this.getEvents("viewupdated").viewupdated(["value"]);},    onchange: this.getEvents("change")},
            placeholder:    {get: function(){return this.__element.placeholder;},   set: function(value){this.__element.placeholder = value||""; this.getEvents("viewupdated").viewupdated(["placeholder"]);}}
        });
    }
    Object.defineProperty(input, "prototype", {value: Object.create(control.prototype)});
    Object.defineProperty(input, "__getViewProperty", {value: function(name) { return control.__getViewProperty(name); }});
    Object.defineProperties(input.prototype,
    {
        constructor:        {value: input},
        __addCustomEvents:  {value: function(events)
        {
            control.prototype.__addCustomEvents.call(this, events);
            Object.defineProperties(events,
            {
                changing:         {value:   {eventNames: ["keydown", "keyup", "mouseup", "touchend", "change"], handler: notifyIfValueHasChangedOrDelay.bind(this)} },
                enter:            {value:   {eventNames: ["keypress"],                                          handler: function(event){ if (event.keyCode==13) { this.pubSub(event); } }}}
            });
        }},
        __createNode:       {value: function(){var element = document.createElement("input"); element.type="textbox"; return element;}, configurable: true},
        select:             {value: function(){this.__element.select(); return this;}},
        onchangingdelay:    {get:   function(){return this.__onchangingdelay;}, set: function(value){Object.defineProperty(this, "__onchangingdelay", {value: value, configurable: true});}}
    });
    return input;
});}();