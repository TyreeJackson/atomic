!function()
{"use strict";root.define("atomic.forms.controls.json", function formsJSONControl(base, elementTemplate, defineDataProperties)
{
    delete elementTemplate.id;
    elementTemplate.parentNode.removeChild(elementTemplate);

    function json(element, selector, parent)
    {
        base.call(this, element, selector, parent);
        defineDataProperties(this, this.__binder,
        {
            value:  {get: function(){return JSON.parse(this.__readout.innerHTML);}, set: function(value){this.__readout.innerHTML = JSON.stringify(value&&value.isObserver?value():value, null, '    ');}}
        });
    }
    Object.defineProperty(json, "prototype", {value: Object.create(base.prototype)});
    Object.defineProperties(json.prototype,
    {
        constructor:    {value: json},
        __createNode:   {value: function(){return elementTemplate.cloneNode(true);}, configurable: true}
    });
    return json;
});}();