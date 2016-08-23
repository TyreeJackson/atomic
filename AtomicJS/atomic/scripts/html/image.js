!function()
{"use strict";root.define("atomic.html.image", function htmlImage(control, defineDataProperties)
{
    function image(elements, selector, parent)
    {
        control.call(this, elements, selector, parent);
        defineDataProperties(this, this.__binder,
        {
            value:  {get: function(){return this.__element.src;}, set: function(value){this.__element.src = value||"";}}
        });
    }
    Object.defineProperty(image, "prototype", {value: Object.create(control.prototype)});
    Object.defineProperties(image.prototype,
    {
        constructor:    {value: image}
    });
    return image;
});}();