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
    function notifyIfValueHasChangedOrDelay(callback)
    {
        if ((this.__lastChangingValueSeen||"") === this.value())  return;
        this.__lastChangingValueSeen = this.value();
        if (this.onchangingdelay !== undefined)
        {
            if (this.__lastChangingTimeout !== undefined)   clearTimeout(this.__lastChangingTimeout);
            this.__lastChangingTimeout  = setTimeout(notifyIfValueHasChanged.bind(this, callback), this.onchangingdelay);
        }
        else    notifyIfValueHasChanged.call(this, callback);
    }
    function input(elements, selector, parent, bindPath)
    {
        control.call(this, elements, selector, parent, bindPath);
        this.__binder.defineDataProperties(this,
        {
            value:  {get: function(){return this.__element.value;}, set: function(value){this.__element.value = value||""; this.getEvents("viewupdated").viewupdated(["value"]);},    onchange: this.getEvents("change")}
        });
    }
    Object.defineProperty(input, "prototype", {value: Object.create(control.prototype)});
    Object.defineProperty(input, "__getViewProperty", {value: function(name) { return control.__getViewProperty(name); }});
    Object.defineProperties(input.prototype,
    {
        constructor:        {value: input},
        __createNode:       {value: function(){var element = document.createElement("input"); element.type="textbox"; return element;}, configurable: true},
        select:             {value: function(){this.__element.select(); return this;}},
        onchangingdelay:    {get:   function(){return this.__onchangingdelay;}, set: function(value){Object.defineProperty(this, "__onchangingdelay", {value: value, configurable: true});}},
        onchanging:         {set:   function(callback) { this.addEventsListener(["keydown", "keyup", "mouseup", "touchend", "change"], notifyIfValueHasChangedOrDelay.bind(this, callback), false, true); }},
        onenter:            {set:   function(callback) { this.addEventListener("keypress", (function(event){ if (event.keyCode==13) { callback.call(this); return cancelEvent(event); } }).bind(this), false, true); }},
        onescape:           {set:   function(callback) { this.addEventListener("keydown", (function(event){ if (event.keyCode==27) { callback.call(this); return cancelEvent(event); } }).bind(this), false, true); }},
    });
    return input;
});}();