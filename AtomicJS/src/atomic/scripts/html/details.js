!function(){"use strict";root.define("atomic.html.details", function htmlDetails(panel, document)
{
    function details(element, selector, parent, bindPath, childKey, protoChildKey)
    {
        panel.call(this, element, selector, parent, bindPath, childKey, protoChildKey);
        var summaryElement  = element.querySelector("summary");
        if (summaryElement == null)
        {
            summaryElement  = document.createElement("summary");
            this.__element.appendChild(summaryElement);
        }
        Object.defineProperties(this, 
        {
            __summaryElement:   {value: summaryElement, configurable: true}
        });
        this.__binder.defineDataProperties(this,
        {
            open:       {get: function(){return this.__element.open==true;},        set: function(value){this.__element.open=!(!value); this.getEvents("viewupdated").viewupdated(["open"]);},    onchange: this.getEvents("toggle")},
            summary:    {get: function(){return this.__getViewData("summary");},    set: function(value){this.__setViewData("summary", value);}}
        });
    }
    Object.defineProperty(details, "prototype", {value: Object.create(panel.prototype)});
    var viewProperties  =
    {
        summary:    { reset:    false,  get: function(control){ return control.__summary    !== undefined ? control.__summary   : control.__summaryElement.innerHTML; },    set: function(control, value){ var val = value&&value.isObserver?value():value; control.__summary   = control.__summaryElement.innerHTML    = val;},     value: function(control, value){ control.__summary = value; } }
    };
    Object.defineProperty(details, "__getViewProperty", {value: function(name) { return viewProperties[name]||panel.__getViewProperty(name); }});
    Object.defineProperties(details.prototype,
    {
        constructor:    {value: details},
        __createNode:   {value: function(){return document.createElement("details");}, configurable: true}
    });
    return details;
});}();