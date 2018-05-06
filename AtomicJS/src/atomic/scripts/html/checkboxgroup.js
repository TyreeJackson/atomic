!function(){"use strict";root.define("atomic.html.checkboxgroup", function htmlCheckboxGroup(input, dataBinder, each)
{
    function setCheckboxGroupValues(values)
    {
        if (typeof values === "function")   values = values();
        if ( !Array.isArray(values)) values  = [values];
        Object.defineProperty(this, "__rawValues", {value: values, configurable: true});
        if (this.__options.length > 0)
        {
            for(var counter=0;counter<this.__options.length;counter++) this.__options[counter].__checkboxElement.checked = values.indexOf(this.__options[counter].value()) > -1;
        }
        else
        {
            var options = this.__element.querySelectorAll("input[name='" + this.__name + "']");
            for(var counter=0;counter<options.length;counter++) options[counter].__checkboxElement.checked = values.indexOf(options[counter].value()) > -1;
        }
    }
    function getCheckboxGroupValues()
    {
        if (this.__options.length == 0) return this.__rawValues;
        var values  = [];
        if (this.__options.length > 0) 
        {
            for(var counter=0;counter<this.__options.length;counter++) if (this.__options[counter].__checkboxElement.checked) values.push(this.__options[counter].value());
        }
        else
        {
            var selectedOptions = this.__element.querySelectorAll("input[name='" + this.__name + "']:checked");
            if (selectedOptions && selectedOptions.length > 0)  for(var counter=0;counter<selectedOptions.length;counter++) values.push(selectedOptions.value);
        }

        Object.defineProperty(this, "__rawValues", {value: values, configurable: true});
        return values;
    }
    function captureTemplateIfNeeded()
    {
        if (this.__templateElement === undefined)
        {
            this.__checkboxButtonSelector	= this.__element.getAttribute("data-atomic-checkboxbutton")||"input[type='checkbox']";
            this.__checkboxLabelSelector    = this.__element.getAttribute("data-atomic-checkboxlabel")||"label";
            this.__templateElement          = this.__element.querySelector("checkboxgroupitem");
            this.__templateElement.parentNode.removeChild(this.__templateElement);
            clearCheckboxGroup(this.__element);
        }
    }
    function checkboxoption(element, selector, name, parent, index)
    {
        Object.defineProperties(this, 
        {
            "parent":               {value: parent},
            "__element":            {value: element},
            "__sourceBinder":       {value: new dataBinder()},
            "__parent":             {value: parent},
            "__checkboxElement":    {value: element.querySelector(parent.__checkboxButtonSelector)},
            "__checkboxLabel":      {value: element.querySelector(parent.__checkboxLabelSelector)},
            "__text":               {value: null, configurable: true},
            "__value":              {value: null, configurable: true}
        });
        this.__sourceBinder.defineDataProperties(this,
        {
            text:   {get: function(){return this.__text;}, set: function(value){Object.defineProperty(this,"__text",{value: value}); if (this.__checkboxLabel != null) this.__checkboxLabel.innerHTML = value&&value.isObserver?value():value;}},
            value:  {get: function(){return this.__value;}, set: function(value){Object.defineProperty(this, "__value", {value: value}); if (this.__checkboxElement != null) this.__checkboxElement.value = value&&value.isObserver?value():value;}}
        });
        this.__checkboxElement.name = name;
        this.__checkboxElement.id   = name+"-"+index;
        this.__checkboxLabel.setAttribute("for", this.__checkboxElement.id);
    }
    Object.defineProperties(checkboxoption.prototype,
    {
        source:     {get: function(){return this.__sourceBinder.data;}, set: function(value){this.__sourceBinder.data = value;}},
        selected:   {get: function(){return this.__checkboxElement.checked;}, set: function(value){this.__checkboxElement.checked = !(!value);}}
    });
    function createOption(sourceItem, index)
    {
        var option          = new checkboxoption(this.__templateElement.cloneNode(true), this.selector+"-"+index, this.__name, this, index);
        option.text.listen({bind: this.optionText||""});
        option.value.listen({bind: this.optionValue||""});
        option.source       = sourceItem;
        return option;
    }
    function checkboxgroup(elements, selector, parent, bindPath)
    {
        input.call(this, elements, selector, parent, bindPath);
        Object.defineProperties(this, 
        {
            "__items":      {value: null, configurable: true},
            "__options":    {value: []},
            "__name":       {value: (this.__element.__selectorPath||"") + (this.__element.id||"unknown")}
        });
        this.__binder.defineDataProperties(this,
        {
            value:  {get: function(){return getCheckboxGroupValues.call(this);}, set: function(value){setCheckboxGroupValues.call(this, value===undefined?null:value);},  onchange: this.getEvents("change")},
            items:
            {
                get:        function() {return this.__items;},
                set:        function(value)
                {
                    Object.defineProperty(this, "__items", {value: value!==undefined&&value.isObserver?value():value, configurable: true});
                    captureTemplateIfNeeded.call(this);

                    bindCheckboxGroupSource.call(this, value);
                }
            }
        });
    }
    Object.defineProperty(checkboxgroup, "prototype", {value: Object.create(input.prototype)});
    Object.defineProperty(checkboxgroup, "__getViewProperty", {value: function(name) { return input.__getViewProperty(name); }});
    Object.defineProperties(checkboxgroup.prototype,
    {
        constructor:        {value: checkboxgroup},
        __createNode:       {value: function(){var element = document.createElement("checkboxgroup"); return element;}, configurable: true},
        count:              {get:   function(){ return this.__elements[0].options.length; }},
        selectedIndex:      {get:   function(){ return this.__elements[0].selectedIndex; },   set: function(value){ this.__element.selectedIndex=value; this.getEvents("viewupdated").viewupdated(["selectedIndex"]); }},
        __isValueSelected:  {value: function(value){return Array.isArray(this.__rawValues) && this.__rawValues.indexOf(value) > -1;}}
    });
    each(["text","value"], function(name)
    {
        var thisName    = name.substr(0,1).toUpperCase()+name.substr(1);
        Object.defineProperty(checkboxgroup.prototype, "option"+thisName, 
        {
            get: function(){ return this["__option"+thisName]; },
            set: function(value)
            {
                Object.defineProperty(this,"__option"+thisName, {value: value, configurable: true});
                each(this.__options, function(option){option[name].bind = value;});
            }
        });
    });
    function clearCheckboxGroup(checkboxGroup){ for(var counter=checkboxGroup.childNodes.length-1;counter>=0;counter--) checkboxGroup.removeChild(checkboxGroup.childNodes[counter]); }
    function rebindCheckboxGroupSource(){bindCheckboxGroupSource.call(this, this.__boundItems);}
    function bindCheckboxGroupSource(items)
    {
        var selectedValue   = this.value();
        clearCheckboxGroup(this.__element);
        this.__options.splice(0, this.__options.length);
        Object.defineProperty(this, "__boundItems", {value: items, configurable: true});
        if (items === undefined)   return;
        for(var counter=0;counter<items.count;counter++)
        {
            var sourceItem  = items.observe(counter);
            var option      = createOption.call(this, sourceItem, counter);
            this.__options.push(option);
            this.__setViewData("appendChild", option.__element);
            option.selected = this.__isValueSelected(option.value());
        }
    }
    return checkboxgroup;
});}();