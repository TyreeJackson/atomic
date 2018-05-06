!function(){"use strict";root.define("atomic.html.image", function htmlImage(control)
{
    function image(elements, selector, parent, bindPath)
    {
        control.call(this, elements, selector, parent, bindPath);
        this.__binder.defineDataProperties(this,
        {
            alt:    {get: function(){return this.__element.alt;},           set: function(value){this.__element.alt = value||""; this.getEvents("viewupdated").viewupdated(["alt"]);}},
            value:  {get: function(){return this.__getViewData("src");},    set: function(value){this.__setViewData("src", value||"");}}
        });
    }
    Object.defineProperty(image, "prototype", {value: Object.create(control.prototype)});
    Object.defineProperty(image, "__getViewProperty", {value: function(name) { return control.__getViewProperty(name); }});
    Object.defineProperties(image.prototype,
    {
        constructor:    {value: image},
        __createNode:   {value: function(){return document.createElement("image");}, configurable: true}
    });
    return image;
});}();