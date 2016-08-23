!function()
{"use strict";root.define("atomic.html.radiogroup", function htmlRadioGroup(input)
{
    function radiogroup(elements, selector, parent) { input.call(this, elements, selector, parent); }
    Object.defineProperty(radiogroup, "prototype", {value: Object.create(input.prototype)});
    Object.defineProperties(radiogroup.prototype,
    {
        constructor:        {value: radiogroup},
        count:              {get: function(){ return this.__elements[0].options.length; }},
        selectedIndex:      {get: function(){ return this.__elements[0].selectedIndex; },   set: function(value){ this.__element.selectedIndex=value; }}
    });
    return radiogroup;
});}();