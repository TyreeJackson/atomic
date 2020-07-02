!function(){"use strict";root.define("atomic.html.select", function htmlSelect(input, dataBinder, each)
{
    function getSelectListValue()
    {
        if (this.__element.options.length > 0)
        for(var counter=0;counter<this.__element.options.length;counter++)  if (this.__element.options[counter].selected)
        {
            return this.__rawValue = this.__element.options[counter].rawValue;
        }
        return this.__rawValue;
    }
    function setSelectListValue(value)
    {
        this.__rawValue = value;
        if (this.items !== undefined)
        {
            var bound       = this.items.bind != undefined;
            if (this.__element.options.length > 0) for(var counter=0;counter<this.__element.options.length;counter++) this.__element.options[counter].selected = (bound ? this.__element.options[counter].rawValue : this.__element.options[counter].value) == value;
            this.getEvents("viewupdated").viewupdated(["value"]);
        }
    }
    function selectoption(element, selector, parent)
    {
        Object.defineProperties(this, 
        {
            "__element":        {value: element, configurable: true},
            "__sourceBinder":   {value: new dataBinder(), configurable: true}
        });
        this.__sourceBinder.defineDataProperties(this,
        {
            text:   {get: function(){return this.__element.text;}, set: function(value){this.__element.text = value&&value.isObserver?value():value;}},
            value:  {get: function(){return this.__element.rawValue;}, set: function(value){this.__element.value = this.__element.rawValue = value&&value.isObserver?value():value; this.selected = parent.__isValueSelected(value);}}
        });
    }
    Object.defineProperties(selectoption.prototype,
    {
        source:     {get: function(){return this.__sourceBinder.data;}, set: function(value){this.__sourceBinder.data = value;}},
        selected:   {get: function(){return this.__element.selected;}, set: function(value){this.__element.selected = !(!value);}},
        destroy:                {value: function()
        {
            this.__sourceBinder.destroy();
            each
            ([
                "__element",
                "__sourceBinder"
            ],
            (function(name)
            {
                Object.defineProperty(this, name, {value: null, configurable: true});
                delete this[name];
            }).bind(this));
            Object.defineProperty(this, "isDestroyed", {value: true});
        }},
    });
    function createOption(sourceItem, index)
    {
        var option          = new selectoption(document.createElement('option'), this.selector+"-"+index, this);
        option.text.listen({bind: this.optionText||""});
        option.value.listen({bind: this.optionValue||""});
        option.source       = sourceItem;
        return option;
    }
    function select(element, selector, parent, bindPath, childKey, protoChildKey)
    {
        input.call(this, element, selector, parent, bindPath, childKey, protoChildKey);
        Object.defineProperties(this, 
        {
            "__items":      {value: null, configurable: true},
            "__options":    {value: [], configurable: true}
        });
        this.__binder.defineDataProperties(this,
        {
            value:  {get: function(){return this.items.bind != undefined ? getSelectListValue.call(this) : this.__element.value;}, set: function(value) {setSelectListValue.call(this, value===undefined?null:value);}, onchange: this.getEvents("change")},
            items:
            {
                get:        function() {return this.__items;},
                set:        function(value)
                {
                    var itemCount       = value !== undefined && value !== null ? value.isObserver ? value("length") : value.length : 0;
                    var items           = value !== undefined && value !== null && value.isObserver ? value() : value;
                    if (items === this.__items && itemCount === this.__itemCount)           return;
                    var truncateIndex   = items === this.__items ? itemCount : 0;
                    Object.defineProperties(this,
                    {
                        __items:        {value: items, configurable: true},
                        __itemCount:    {value: itemCount, configurable: true},
                    });

                    bindSelectListSource.call(this, value, truncateIndex);
                }
            }
        });
    }
    Object.defineProperty(select, "prototype", {value: Object.create(input.prototype)});
    Object.defineProperty(select, "__getViewProperty", {value: function(name) { return input.__getViewProperty(name); }});
    Object.defineProperties(select.prototype,
    {
        constructor:        {value: select},
        __createNode:       {value: function(){var element = document.createElement("select"); return element;}, configurable: true},
        count:              {get:   function(){ return this.__element.options.length; }},
        selectedIndex:      {get:   function(){ return this.__element.selectedIndex; },   set: function(value){ this.__element.selectedIndex=value; this.getEvents("viewupdated").viewupdated(["selectedIndex"]); }},
        __isValueSelected:  {value: function(value){return this.__rawValue === value;}},
        destroy:            {value: function()
        {
            bindSelectListSource.call(this, undefined, 0);
            input.prototype.destroy.call(this);
        }}
    });
    each(["text","value"], function(name)
    {
        var thisName    = name.substr(0,1).toUpperCase()+name.substr(1);
        Object.defineProperty(select.prototype, "option"+thisName, 
        {
            get: function(){ return this["__option"+thisName]; },
            set: function(value)
            {
                Object.defineProperty(this,"__option"+thisName, {value: value, configurable: true});
                each(this.__options, function(option){option[name].bind = value;});
            }
        });
    });
    function removeOption(index)
    {
        var option  = this.__options[index];
        this.__element.removeChild(option.__element);
        option.destroy();
        this.__options.splice(index, 1);
    }
    function clearOptions(truncateIndex){ for(var counter=this.__options.length-1;counter>=truncateIndex;counter--) removeOption.call(this, counter); }
    function bindSelectListSource(items, truncateIndex)
    {
        var selectedValue   = this.__rawValue;
        var itemsCount      = items !== undefined && items !== null ? items.count : 0;
        clearOptions.call(this, truncateIndex);
        var startingIndex   = this.__options.length;
        if (items === undefined)   return;

        for(var counter=startingIndex;counter<itemsCount;counter++)
        {
            var sourceItem  = items.observe(counter, true);
            var option      = createOption.call(this, sourceItem, counter);
            this.__options.push(option);
            this.__element.appendChild(option.__element);
        }
    }
    return select;
});}();