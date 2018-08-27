!function(){"use strict";root.define("atomic.html.multiselect", function htmlMultiSelect(base)
{
    function setSelectListValues(values)
    {
        if (typeof values === "function")   values = values();
        if ( !Array.isArray(values)) values  = [values];
        this.__rawValue = values;
        if (this.__element.options.length > 0) for(var counter=0;counter<this.__element.options.length;counter++) this.__element.options[counter].selected = values.indexOf(this.__element.options[counter].rawValue) > -1;
        this.getEvents("viewupdated").viewupdated(["value"]);
    }
    function getSelectListValues()
    {
        if (this.__element.options.length == 0) return this.__rawValue;
        var values  = [];
        if (this.__element.options.length > 0) for(var counter=0;counter<this.__element.options.length;counter++) if (this.__element.options[counter].selected)   values.push(this.__element.options[counter].rawValue);
        return this.__rawValue = values;
    }
    function multiselect(elements, selector, parent, bindPath, childKey, protoChildKey)
    {
        base.call(this, elements, selector, parent, bindPath, childKey, protoChildKey);
        this.__binder.defineDataProperties(this,
        {
            value:  {get: function(){return getSelectListValues.call(this);}, set: function(value){setSelectListValues.call(this, value===undefined?null:value);},  onchange: this.getEvents("change")}
        });
    }
    Object.defineProperty(multiselect, "prototype", {value: Object.create(base.prototype)});
    Object.defineProperty(multiselect, "__getViewProperty", {value: function(name) { return base.__getViewProperty(name); }});
    Object.defineProperties(multiselect.prototype,
    {
        constructor:        {value: multiselect},
        __createNode:       {value: function(){var element = document.createElement("select"); element.multiple="multiple"; return element;}, configurable: true},
        count:              {get:   function(){ return this.__element.options.length; }},
        selectedIndexes:    {get:   function(){ return this.__element.selectedIndex; },   set: function(value){ this.__element.selectedIndex=value; this.getEvents("viewupdated").viewupdated(["selectedIndex"]); }},
        size:               {get:   function(){ return this.__element.size; },            set: function(value){ this.__elements[0].size=value; this.getEvents("viewupdated").viewupdated(["size"]); }},
        __isValueSelected:  {value: function(value){return Array.isArray(this.__rawValue) && this.__rawValue.indexOf(value) > -1;}}
    });
    return multiselect;
});}();