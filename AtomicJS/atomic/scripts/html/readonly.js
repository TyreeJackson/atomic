!function()
{"use strict";root.define("atomic.html.readonly", function htmlReadOnly(control, defineDataProperties)
{
    function readonly(elements, selector, parent)
    {
        control.call(this, elements, selector, parent);
        defineDataProperties(this, this.__binder,
        {
            value:  {get: function(){return this.__element.innerHTML;}, set: function(value){this.__element.innerHTML = value;}}
        });
    }
    Object.defineProperty(readonly, "prototype", {value: Object.create(control.prototype)});
    Object.defineProperties(readonly.prototype,
    {
        constructor:        {value: readonly}
    });
    return readonly;
});}();