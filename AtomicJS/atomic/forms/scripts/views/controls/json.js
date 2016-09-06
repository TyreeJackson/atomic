!function()
{"use strict";root.define("atomic.forms.controls.json", function formsJSONControl(base, elementTemplate, defineDataProperties)
{
    delete elementTemplate.id;
    elementTemplate.parentNode.removeChild(elementTemplate);

    function json(element, selector, parent)
    {
        base.call(this, element, selector, parent);
        defineDataProperties(this.controls.readout, this.controls.readout.__binder,
        {
            value:  {get: function(){return JSON.parse(this.controls.readout.value());}, set: function(value){this.controls.readout.value(JSON.stringify(value&&value.isObserver?value():value, null, '    '));}}
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