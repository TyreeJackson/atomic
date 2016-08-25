!function()
{"use strict";root.define("atomic.html.select", function htmlSelect(input, defineDataProperties, dataBinder)
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
        if (this.__element.options.length > 0) for(var counter=0;counter<this.__element.options.length;counter++) this.__element.options[counter].selected = this.__element.options[counter].rawValue == value;
    }
    function selectoption(element, selector, parent)
    {
        Object.defineProperties(this, 
        {
            "__element":        {value: element},
            "__sourceBinder":   {value: new dataBinder()}
        });
        defineDataProperties(this, this.__sourceBinder,
        {
            text:   {get: function(){return this.__element.text;}, set: function(value){this.__element.text = value;}},
            value:  {get: function(){return this.__element.rawValue;}, set: function(value){this.__element.value = this.__element.rawValue = value;}}
        });
    }
    Object.defineProperties(selectoption.prototype,
    {
        source:     {get: function(){return this.__sourceBinder.data;}, set: function(value){this.__sourceBinder.data = value;}},
        selected:   {get: function(){return this.__element.selected;}, set: function(value){this.__element.selected = !(!value);}}
    });
    function createOption(sourceItem, index)
    {
        var option          = new selectoption(document.createElement('option'), this.selector+"-"+index, this);
        option.text.bind    = this.__sourceText||"";
        option.value.bind   = this.__sourceValue||"";
        option.source       = sourceItem;
        return option;
    }
    function select(element, selector, parent)
    {
        input.call(this, element, selector, parent);
        Object.defineProperties(this, 
        {
            "__items":      {value: null, configurable: true},
            "__options":    {value: []}
        });
        defineDataProperties(this, this.__binder,
        {
            value:  {get: function(){return getSelectListValue.call(this);}, set: function(value){setSelectListValue.call(this, value||null);},  onchange: this.getEvents("change")}
        });
        defineDataProperties(this, this.__sourceBinder,
        {
            items:
            {
                get:        function() {return this.__items;},
                set:        function(value)
                {
                    Object.defineProperty(this, "__items", {value: value!==undefined&&value.isObserver?value():value, configurable: true});

                    if (value!==undefined)
                    bindSelectListSource.call(this, value);
                }
            }
        });
    }
    Object.defineProperty(select, "prototype", {value: Object.create(input.prototype)});
    Object.defineProperties(select.prototype,
    {
        constructor:        {value: select},
        count:              {get:   function(){ return this.__elements[0].options.length; }},
        selectedIndex:      {get:   function(){ return this.__elements[0].selectedIndex; },   set: function(value){ this.__element.selectedIndex=value; }},
        __isValueSelected:  {value: function(value){return this.__rawValue === value;}}
    });
    function clearOptions(){ for(var counter=this.__element.options.length-1;counter>=0;counter--) this.__element.remove(counter); }
    function bindSelectListSource(items)
    {
        var selectedValue   = this.value();
        clearOptions.call(this);
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
    return select;
});}();