!function()
{"use strict";root.define("atomic.forms.controls.menu", function formsMenuControl(base, elementTemplate, defineDataProperties, viewAdapterFactory)
{
    delete elementTemplate.id;
    elementTemplate.parentNode.removeChild(elementTemplate);

    function menu(element, selector, parent)
    {
        base.call(this, element, selector, parent, {});
        defineDataProperties(this, this.__binder,
        {
            value:  {get: function(){return this.__element.checked;}, set: function(value){this.__element.checked = value===true;},  onchange: this.getEvents("change")}
        });
    }
    Object.defineProperty(menu, "prototype", {value: Object.create(base.prototype)});
    Object.defineProperties(menu.prototype,
    {
        constructor:    {value: menu},
        __createNode:   {value: function(){return elementTemplate.cloneNode(true);}, configurable: true}
    });
    return menu;
});}();