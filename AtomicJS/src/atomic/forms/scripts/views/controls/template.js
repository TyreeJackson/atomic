!function()
{"use strict";root.define("atomic.forms.controls.template", function formsTemplateControl(base, dataBinder, defineDataProperties)
{

    function getColClassWidth()
    {
        var classes = (this.__element.className||"").split(" ");
        for(var counter=classes.length-1;counter>=0;counter--)
        {
            var cssClass                = classes[counter];
            if (cssClass.substr(0,4).toLowerCase()==="col-")
            {
                var cssClassSegments    = cssClass.split("-");
                var width               = parseInt(cssClassSegments[cssClassSegments.length-1]);
                if (!isNaN(width))  return width;
            }
            return undefined;
        }
    }
    
    function setColClassWidth(newWidth)
    {
        var valueSet                    = false;
        var classes                     = (this.__element.className||"").split(" ");
        for(var counter=classes.length-1;counter>=0;counter--)
        {
            var cssClass                = classes[counter];
            if (cssClass.substr(0,4).toLowerCase()==="col-")
            {
                var cssClassSegments    = cssClass.split("-");
                var width               = parseInt(cssClassSegments[cssClassSegments.length-1]);
                if (!isNaN(width))
                {
                    classes[counter]    = valueSet || newWidth === undefined || newWidth === null ? "" : ("col-xs-"+newWidth);
                    valueSet            = true;
                }
            }
        }
        if (!valueSet)  this.__element.className += "col-xs-" + newWidth;
        else            this.__element.className = classes.join(" ");
    }

    function template(element, selector, parent, definition)
    {
        base.call(this, element, selector, parent);
        Object.defineProperties(this, 
        {
            __layoutBinder: {value: new dataBinder()}
        });
        defineDataProperties(this, this.__layoutBinder,
        {
            layout: {get: function(){return this.__layout;}, set: function(value){Object.defineProperty(this, "__layout", {value: value, configurable: true});}},
            width:  {get: function(){return getColClassWidth.call(this);}, set: function(value){setColClassWidth.call(this, value);}}
        });
        this.width.bind = "width";
        template.prototype.init.call(this, definition);
    }
    Object.defineProperty(template, "prototype", {value: Object.create(base.prototype)});
    Object.defineProperties(template.prototype,
    {
        constructor:            {value: template},
        layoutData:             {get:   function(){return this.__layoutBinder.data;},   set: function(value){this.__layoutBinder.data = value;}},
        init:                   {value: function(definition)
        {
            base.prototype.init.call(this, definition);
            this.attachControls(definition.controls, this.__element);
        }},
        __templateDefinition:   {value: {}}
    });
    return template;
});}();