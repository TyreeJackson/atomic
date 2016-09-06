!function()
{"use strict";root.define("atomic.forms.controls.static", function formsStaticControl(base, elementTemplate, defineDataProperties)
{
    delete elementTemplate.id;
    elementTemplate.parentNode.removeChild(elementTemplate);

    function staticControl(element, selector, parent)
    {
        base.call(this, element, selector, parent, {controls:
        {
            label:      { type: "readonly", selector: ".static-label" },
            readout:    { type: "readonly", selector: ".static-readout" }
        }});
        defineDataProperties(this, this.__layoutBinder,
        {
            label:  {get: function(){return this.controls.label.value();}, set: function(value){this.controls.label.value(value&&value.isObserver?value():value);}}
        });
        defineDataProperties(this, this.__binder,
        {
            value:  {get: function(){return this.controls.readout.value();}, set: function(value){this.controls.readout.value(value&&value.isObserver?value():value);}}
        });
        this.label.bind = "label";
    }
    Object.defineProperty(staticControl, "prototype", {value: Object.create(base.prototype)});
    Object.defineProperties(staticControl.prototype,
    {
        constructor:    {value: staticControl},
        __createNode:   {value: function(){return elementTemplate.cloneNode(true);}, configurable: true}
    });
    return staticControl;
});}();