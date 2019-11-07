!function(){"use strict";root.define("atomic.html.readonly", function htmlReadOnly(control, each)
{
    function readonly(elements, selector, parent, bindPath, childKey, protoChildKey)
    {
        control.call(this, elements, selector, parent, bindPath, childKey, protoChildKey);
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
                    {
                        for(var key in value)
                        {
                            for(var counter=0;counter<this.__elements.length;counter++) this.__elements[counter].setAttribute("data-"+key, value[key]);
                        }
                        this.getEvents("viewupdated").viewupdated(Object.keys(value));
                    }
                }
            },
            disabled:           {get: function(){return this.__element.disabled;},                  set: function(value){each(this.__elements, function(element){element.disabled = !(!value);}); this.__element.disabled=!(!value); this.getEvents("viewupdated").viewupdated(["disabled"]);}},
            display:            {get: function(){return this.__getViewData("styles.display")=="";}, set: function(value){this[value?"show":"hide"]();}},
            enabled:            {get: function(){return !this.__element.disabled;},                 set: function(value){each(this.__elements, function(element){element.disabled = !value;}); this.__element.disabled=!value; this.getEvents("viewupdated").viewupdated(["disabled"]);}},
            tooltip:            {get: function(){return this.__element.title;},                     set: function(value){var val = value&&value.isObserver?value():(value||""); each(this.__elements, function(element){element.title = val;}); this.__element.title = val; this.getEvents("viewupdated").viewupdated(["title"]);}},
            value:              {get: function(){return this.__getViewData("innerHTMLs");},         set: function(value){this.__setViewData("innerHTMLs", value);}}
        });
    }
    Object.defineProperty(readonly, "prototype", {value: Object.create(control.prototype)});
    var viewProperties  =
    {
        innerHTMLs:         { reset:    false,  get: function(control){ return control.__value !== undefined ? control.__value : control.__element.innerHTML; },                                set: function(control, value){ var val = value&&value.isObserver?value():value; control.__value=val; for(var counter=0;counter<control.__elements.length;counter++) control.__elements[counter].innerHTML = val; control.__value = control.__element.innerHTML = val;}, value: function(control, value){ control.__value = value; } },
        "styles.display":   { reset:    true,   get: function(control){ return control.__element.__display !== undefined ? control.__element.__display : control.__element.style.display; },    set: function(control, value){ for(var counter=0;counter<control.__elements.length;counter++) control.__elements[counter].style.display=value; control.__element.__display = control.__element.style.display=value; },                                                  value: function(control, value){ control.__element.__display = value; } }
    };
    Object.defineProperty(readonly, "__getViewProperty", {value: function(name) { return viewProperties[name]||control.__getViewProperty(name); }});
    Object.defineProperties(readonly.prototype,
    {
        constructor:    {value: readonly},
        __createNode:   {value: function(){return document.createElement("span");}, configurable: true},
        hide:           {value: function(){this.__setViewData("styles.display", "none"); this.triggerEvent("hide"); return this;}},
        show:           {value: function(){this.__setViewData("styles.display", ""); this.triggerEvent("show"); return this;}},
        toggleDisplay:  {value: function(condition) { if (condition === undefined) condition = this.__getViewData("styles.display")=="none"; this[condition?"show":"hide"](); return this; }},
    });
    return readonly;
});}();