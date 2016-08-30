!function()
{"use strict";root.define("atomic.forms.controls.static", function formsStaticControl(base, elementTemplate, defineDataProperties)
{
    delete elementTemplate.id;
    elementTemplate.parentNode.removeChild(elementTemplate);

    function staticControl(element, selector, parent)
    {
        base.call(this, element, selector, parent);
        Object.defineProperties(this,
        {
            __label:    {value: this.__element.querySelector(".static-label")},
            __readout:  {value: this.__element.querySelector(".static-readout")}
        });
        defineDataProperties(this, this.__layoutBinder,
        {
            label:  {get: function(){return this.__label.innerHTML;}, set: function(value){this.__label.innerHTML = (value&&value.isObserver?value():value);}}
        });
        defineDataProperties(this, this.__binder,
        {
            value:  {get: function(){return this.__readout.innerHTML;}, set: function(value){this.__readout.innerHTML = (value&&value.isObserver?value():value);}}
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