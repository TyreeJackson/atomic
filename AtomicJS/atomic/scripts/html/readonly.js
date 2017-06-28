!function()
{"use strict";root.define("atomic.html.readonly", function htmlReadOnly(control, each)
{
    function readonly(elements, selector, parent)
    {
        control.call(this, elements, selector, parent);
        Object.defineProperty(this, "__elements", {value: Array.prototype.slice.call(parent.__element.querySelectorAll(selector)), configurable: true});
        this.__binder.defineDataProperties(this,
        {
            attributes:         
            {
                get:    function(){return this.__attributes;}, 
                set:    function(value)
                {
                    if (value!==undefined&&value.isObserver) value=value(); 
                    this.__attributes=value;

                    if (value!==undefined)
                    for(var key in value)
                    {
                        each(this.__elements, function(element){element.setAttribute("data-"+key, value[key]);});
                        this.__element.setAttribute("data-" + key, value[key]);
                    }
                }
            },
            disabled:           {get: function(){return this.__element.disabled;},              set: function(value){each(this.__elements, function(element){element.disabled = !(!value);}); this.__element.disabled=!(!value);}},
            display:            {get: function(){return this.__element.style.display=="";},     set: function(value){this[value?"show":"hide"]();}},
            enabled:            {get: function(){return !this.__element.disabled;},             set: function(value){each(this.__elements, function(element){element.disabled = !value;}); this.__element.disabled=!value;}},
            for:              {get: function(){return this.__element.getAttribute("for");},   set: function(value){each(this.__elements, function(element){element.setAttribute("for", value);}); this.__element.setAttribute("for", value);}},
            tooltip:            {get: function(){return this.__element.title;},                 set: function(value){var val = value&&value.isObserver?value():(value||""); each(this.__elements, function(element){element.title = val;}); this.__element.title = val;}},
            value:              {get: function(){return this.__element.innerHTML;},             set: function(value){var val = value&&value.isObserver?value():value; each(this.__elements, function(element){element.innerHTML = val;}); this.__element.innerHTML = val;}}
        });
    }
    Object.defineProperty(readonly, "prototype", {value: Object.create(control.prototype)});
    Object.defineProperties(readonly.prototype,
    {
        constructor:    {value: readonly},
        __createNode:   {value: function(){return document.createElement("span");}, configurable: true},
        hide:               {value: function(){each(this.__elements, function(element){element.style.display="none";}); this.__element.style.display="none"; this.triggerEvent("hide"); return this;}},
        show:               {value: function(){each(this.__elements, function(element){element.style.display="";}); this.__element.style.display=""; this.triggerEvent("show"); return this;}},
    });
    return readonly;
});}();