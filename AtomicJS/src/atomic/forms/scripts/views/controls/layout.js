!function()
{"use strict";root.define("atomic.forms.controls.layout", function formsLayoutControl(base, elementTemplate, defineDataProperties, viewAdapterFactory, each)
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

    function bindLayout(observer)
    {
        if (observer() === undefined) return;
        var documentFragment        = document.createDocumentFragment();
        var retained                = unbindLayout.call(this, observer());
        for(var dataItemCounter=0;dataItemCounter<observer.count;dataItemCounter++)
        {
            var subDataItem         = observer.observe(dataItemCounter);
            var selectorPath        = this.getSelectorPath();
            var selector            = (subDataItem().selector||("#"+subDataItem().name));
            var control             = locate(subDataItem(), retained);
            if (control === null)
            {
                control             = viewAdapterFactory.createControl(subDataItem(), undefined, this, selector);
                control.layoutData  = subDataItem;

                if (this.data !== undefined)
                control.data        = this.data.observe(this.bind);
            }
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
        base.call(this, element, selector, parent, {});
        defineDataProperties(this, this.__layoutBinder, {layout: {onupdate: function(value)
        {
            bindLayout.call(this, this.layoutData.observe(this.layout.bind));
        }}});
        defineDataProperties(this, this.__binder, {value: {onupdate: function(value)
        {
            each(this.__controlKeys, (function(controlKey){if (!this.controls[controlKey].isDataRoot) this.controls[controlKey].data = this.data.observe(this.bind||"");}).bind(this));
        }}});
        this.layout.bind    = "layout";
    }
    Object.defineProperty(layout, "prototype", {value: Object.create(base.prototype)});
    Object.defineProperties(layout.prototype,
    {
        constructor:    {value: layout},
        __createNode:   {value: function(){return elementTemplate.cloneNode(true);}, configurable: true}
    });
    return layout;
});}();