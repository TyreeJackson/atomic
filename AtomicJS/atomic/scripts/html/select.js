!function()
{"use strict";root.define("atomic.html.select", function htmlSelect(input, defineDataProperties)
{
    function select(elements, selector, parent)
    {
        input.call(this, elements, selector, parent);
        Object.defineProperties(this, 
        {
            "__items":  {value: null, configurable: true}
        });
        defineDataProperties(this, this.__sourceBinder,
        {
            value:  {get: function(){return getSelectListValue.call(this);}, set: function(value){setSelectListValue.call(this, value||null);},  onchange: this.getEvents("change")},
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
        count:              {get: function(){ return this.__elements[0].options.length; }},
        selectedIndex:      {get: function(){ return this.__elements[0].selectedIndex; },   set: function(value){ this.__element.selectedIndex=value; }}
    });
    function bindSelectListSource(items)
    {
        var selectedValue   = this.value;
        var isArray         = Array.isArray(selectedValue!==undefined && selectedValue.isObserver ? selectedValue() : selectedValue);
        clearOptions.call(this);
        if (items === undefined)   return;
        for(var counter=0;counter<items.length;counter++)
        {
            var option      = createOption.call(this, items[counter]); document.createElement('option');
            var sourceItem  = items[counter];
            option.text     = this.__bindSourceText !== undefined ? sourceItem[this.__bindSourceText] : sourceItem;
            if (!isArray)   option.selected = (option.rawValue = this.__bindSourceValue !== undefined ? sourceItem[this.__bindSourceValue] : sourceItem) == selectedValue;
            else            option.selected = selectedValue.indexOf(option.rawValue = this.__bindSourceValue !== undefined ? sourceItem[this.__bindSourceValue] : sourceItem) > -1;
            this.__element.appendChild(option);
        }
    }
    return select;
});}();