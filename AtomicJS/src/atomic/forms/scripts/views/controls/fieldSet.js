!function()
{"use strict";root.define("atomic.forms.controls.fieldSet", function formsFieldSetControl(control, elementTemplate, defineDataProperties, viewAdapterFactory)
{
    delete elementTemplate.id;
    elementTemplate.parentNode.removeChild(elementTemplate);

    function locate(item, retained)
    {
        for(var counter=0;counter<retained.length;counter++) if (retained[counter].data() === item)
        {
            var retainedControl = retained[counter];
            removeFromArray(retained, counter);
            return retainedControl;
        }
        return null;
    }

    function bindfieldSet(observer)
    {
        if (observer() === undefined) return;
        var documentFragment    = document.createDocumentFragment();
        var retained            = unbindLayout.call(this, observer());
        for(var dataItemCounter=0;dataItemCounter<observer.count;dataItemCounter++)
        {
            var subDataItem                 = observer.observe(dataItemCounter);
            var selectorPath                = this.getSelectorPath();
            var selector                    = (subDataItem().selector||("#"+subDataItem.name));
            var control                     = locate(subDataItem(), retained)||viewAdapterFactory.createControl(subDataItem(), undefined, this, selector);
            if (control !== undefined)
            {
                this.__controlKeys.push(subDataItem().name);
                this.controls[subDataItem().name]   = control;
                documentFragment.appendChild(control.__element);
            }
        }
        this.__element.appendChild(documentFragment);
    }
    function unbindLayout(keepList)
    {
        var retain  = [];
        if (this.__controls !== undefined)
        for(var controlKey in this.__controls)
        {
            var control = this.__controls[controlKey];
            if (keepList.indexOf(control.layoutData()) > -1)    retain.push(control);
            else                                                {control.layoutData = undefined;}
            control.__element.parentNode.removeChild(control.__element);
        }
        this.__controls = {};
        return retain;
    }

    function layout(element, selector, parent)
    {
        control.call(this, element, selector, parent);
        Object.defineProperties(this,
        {
            "__controlKeys":    {value: []},
            controls:           {value: {}}
        });
        defineDataProperties(this, this.__binder, {value: {onupdate: function(value)
        {
            bindLayout.call(this, this.data.observe(this.bind));
        }}});
    }
    Object.defineProperty(layout, "prototype", {value: Object.create(control.prototype)});
    Object.defineProperties(layout.prototype,
    {
        constructor:    {value: layout},
        __createNode:   {value: function(){return elementTemplate.cloneNode(true);}, configurable: true}
    });
    return layout;
});}();