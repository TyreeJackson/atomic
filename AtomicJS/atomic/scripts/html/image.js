!function()
{"use strict";root.define("atomic.html.image", function htmlImage(control)
{
    function image(elements, selector, parent)
    {
        control.call(this, elements, selector, parent);
        this.__binder.defineDataProperties(this,
        {
            value:  {get: function(){return this.__element.src;}, set: function(value){this.__element.src = value||"";}}
        });
    }
    Object.defineProperty(image, "prototype", {value: Object.create(control.prototype)});
    Object.defineProperties(image.prototype,
    {
        constructor:    {value: image},
        __createNode:   {value: function(){return document.createElement("image");}, configurable: true}
    });
    return image;
});}();