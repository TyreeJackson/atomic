!function()
{"use strict";root.define("atomic.html.radiogroup", function htmlRadioGroup(input, dataBinder, each)
{
    function setRadioGroupValue(value)
    {
        Object.defineProperty(this, "__rawValue", {value: value, configurable: true});
        if (this.__options.length > 0) for(var counter=0;counter<this.__options.length;counter++) this.__options[counter].selected = this.__options[counter].value() == value;
        else
        {
            var options = this.__element.querySelectorAll("input[name='" + this.__name + "']");
            for(var counter=0;counter<options.length;counter++) options[counter].checked = options[counter].value == value;
        }
    }
    function getRadioGroupValue()
    {
        if (this.__options.length > 0)
        {
            for(var counter=0;counter<this.__options.length;counter++) if (this.__options[counter].selected)
            {
                Object.defineProperty(this, "__rawValue", {value: this.__options[counter].value(), configurable: true});
                break;
            }
        }
        else
        {
            var selectedOption  = this.__element.querySelector("input[name='" + this.__name + "']:checked");
            if (selectedOption) Object.defineProperty(this, "__rawValue", {value: selectedOption.value, configurable: true});
        }
        return this.__rawValue;
    }
    function captureTemplateIfNeeded()
    {
        if (this.__templateElement === undefined)
        {
            this.__radioButtonSelector	= this.__element.getAttribute("data-atomic-radiobutton")||"input[type='radio']";
            this.__radioLabelSelector   = this.__element.getAttribute("data-atomic-radiolabel")||"label";
            this.__templateElement      = this.__element.querySelector("radiogroupitem");
            this.__templateElement.parentNode.removeChild(this.__templateElement);
            clearRadioGroup(this.__element);
        }
    }
    function radiooption(element, selector, name, parent, index)
    {
        Object.defineProperties(this, 
        {
            "parent":           {value: parent},
            "__element":        {value: element},
            "__sourceBinder":   {value: new dataBinder()},
            "__parent":         {value: parent},
            "__radioElement":   {value: element.querySelector(parent.__radioButtonSelector)},
            "__radioLabel":     {value: element.querySelector(parent.__radioLabelSelector)},
            "__text":           {value: null, configurable: true},
            "__value":          {value: null, configurable: true}
        });
        this.__sourceBinder.defineDataProperties(this,
        {
            text:   {get: function(){return this.__text;}, set: function(value){Object.defineProperty(this,"__text",{value: value}); if (this.__radioLabel != null) this.__radioLabel.innerHTML = value&&value.isObserver?value():value;}},
            value:  {get: function(){return this.__value;}, set: function(value){Object.defineProperty(this, "__value", {value: value}); if (this.__radioElement != null) this.__radioElement.value = value&&value.isObserver?value():value;}}
        });
        this.__radioElement.name    = name;
        this.__radioElement.id      = name+"-"+index;
        this.__radioLabel.setAttribute("for", this.__radioElement.id);
    }
    Object.defineProperties(radiooption.prototype,
    {
        source:     {get: function(){return this.__sourceBinder.data;}, set: function(value){this.__sourceBinder.data = value;}},
        selected:   {get: function(){return this.__radioElement.checked;}, set: function(value){this.__radioElement.checked = !(!value);}}
    });
    function createOption(sourceItem, index)
    {
        var option          = new radiooption(this.__templateElement.cloneNode(true), this.selector+"-"+index, this.__name, this, index);
        option.text.bind    = this.optionText||"";
        option.value.bind   = this.optionValue||"";
        option.source       = sourceItem;
        return option;
    }
    function radiogroup(elements, selector, parent)
    {
        input.call(this, elements, selector, parent);
        Object.defineProperties(this, 
        {
            "__items":      {value: null, configurable: true},
            "__options":    {value: []},
            "__name":       {value: (this.__element.__selectorPath||"") + (this.__element.id||"unknown")}
        });
        this.__binder.defineDataProperties(this,
        {
            value:  {get: function(){return getRadioGroupValue.call(this);}, set: function(value){setRadioGroupValue.call(this, value===undefined?null:value);},  onchange: this.getEvents("change")},
            items:
            {
                get:        function() {return this.__items;},
                set:        function(value)
                {
                    Object.defineProperty(this, "__items", {value: value!==undefined&&value.isObserver?value():value, configurable: true});
                    captureTemplateIfNeeded.call(this);

                    bindRadioGroupSource.call(this, value);
                }
            }
        });
        this.__element.addEventListener
        (
            "click", 
            (function(event)
            {
                event=event||window.event; 
                if (event.target.name === this.__name)
                {
                    this.value(getRadioGroupValue.call(this));
                    this.triggerEvent("change");
                }
                event.cancelBubble=true;
                if (event.stopPropagation) event.stopPropagation();
                return false;
            }).bind(this),
            true
        );
    }
    Object.defineProperty(radiogroup, "prototype", {value: Object.create(input.prototype)});
    Object.defineProperties(radiogroup.prototype,
    {
        constructor:        {value: radiogroup},
        __createNode:       {value: function(){var element = document.createElement("radiogroup"); return element;}, configurable: true},
        count:              {get:   function(){ return this.__elements[0].options.length; }},
        selectedIndex:      {get:   function(){ return this.__elements[0].selectedIndex; },   set: function(value){ this.__element.selectedIndex=value; }},
        __isValueSelected:  {value: function(value){return this.__rawValue === value;}},
    });
    each(["text","value"], function(name)
    {
        var thisName    = name.substr(0,1).toUpperCase()+name.substr(1);
        Object.defineProperty(radiogroup.prototype, "option"+thisName, 
        {
            get: function(){ return this["__option"+thisName]; },
            set: function(value)
            {
                Object.defineProperty(this,"__option"+thisName, {value: value, configurable: true});
                each(this.__options, function(option){option[name].bind = value;});
            }
        });
    });
    function clearRadioGroup(radioGroup){ for(var counter=radioGroup.childNodes.length-1;counter>=0;counter--) radioGroup.removeChild(radioGroup.childNodes[counter]); }
    function rebindRadioGroupSource(){bindRadioGroupSource.call(this, this.__boundItems);}
    function bindRadioGroupSource(items)
    {
        var selectedValue   = this.value();
        clearRadioGroup(this.__element);
        Object.defineProperty(this, "__boundItems", {value: items, configurable: true});
        if (items === undefined)   return;
        for(var counter=0;counter<items.count;counter++)
        {
            var sourceItem  = items.observe(counter);
            var option      = createOption.call(this, sourceItem, counter);
            this.__options.push(option);
            this.__element.appendChild(option.__element);
            option.selected = this.__isValueSelected(option.value());
        }
    }
    return radiogroup;
});}();