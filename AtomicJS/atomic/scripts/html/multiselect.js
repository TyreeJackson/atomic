!function()
{"use strict";root.define("atomic.html.multiselect", function htmlMultiSelect(input)
{
    function multiselect(elements, selector, parent) { input.call(this, elements, selector, parent); }
    Object.defineProperty(multiselect, "prototype", {value: Object.create(input.prototype)});
    Object.defineProperties(multiselect.prototype,
    {
        constructor:        {value: multiselect},
        count:              {get: function(){ return this.__element.options.length; }},
        selectedIndexes:    {get: function(){ return this.__element.selectedIndex; },   set: function(value){ this.__element.selectedIndex=value; }},
        size:               {get: function(){ return this.__element.size; },            set: function(value){ this.__elements[0].size=value; }}
    });
    return multiselect;
});}();