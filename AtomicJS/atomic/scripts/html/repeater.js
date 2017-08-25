!function()
{"use strict";root.define("atomic.html.repeater", function htmlRepeater(control, removeFromArray)
{
    var querySelector       =
    function(uiElement, selector, selectorPath, typeHint)
    {
        return uiElement.querySelector(selector)||document.createElement("div");
    };
    function removeAllElementChildren(element)
    {
        while(element.lastChild)    element.removeChild(element.lastChild);
    }
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
    function createTemplateCopy(templateKey, subDataItem, counter, retained)
    {
        var templateElement = this.__templateElements[templateKey];
        if (templateElement.declaration.skipItem !== undefined && templateElement.declaration.skipItem(subDataItem))    return;
        var key             = templateElement.declaration.getKey.call({parent: this, index: counter}, subDataItem);

        var retainedControl = locate(subDataItem(), retained);
        if (retainedControl !== null)   return { key: key, parent: templateElement.parent, control: retainedControl };

        var elementCopy     = templateElement.element.cloneNode(true);
        elementCopy.setAttribute("id", key);
        var clone           = { key: key, parent: templateElement.parent, control: this.createControl(templateElement.declaration, elementCopy, this, "#" + key) };
        clone.control.data  = subDataItem;
        return clone;
    };
    function extractDeferredControls(templateDeclarations, viewElement)
    {
        if (templateDeclarations === undefined) return;
        for(var templateKey in templateDeclarations)
        {
            this.__templateKeys.push(templateKey);
            var templateDeclaration                         = templateDeclarations[templateKey];
            if (templateDeclaration.getKey === undefined)   templateDeclaration.getKey = function(data){return this.parent.__selector+"-"+this.__selector+"-"+this.index;}
            var templateElement                             = querySelector(viewElement, (templateDeclaration.selector||("#"+templateKey)), this.getSelectorPath());
            var templateElementParent                       = templateElement.parentNode;
            if (templateElementParent !== null)             templateElementParent.removeChild(templateElement);
            this.__templateElements[templateKey]            =
            {
                parent:         templateElementParent||viewElement,
                declaration:    templateDeclaration,
                element:        templateElement
            };
        }
        for(var templateKey in templateDeclarations)
        removeAllElementChildren(this.__templateElements[templateKey].parent);
    }

    function bindRepeatedList(observer)
    {
        if (observer() === undefined) return;
        var documentFragment    = document.createDocumentFragment();
        var retained            = unbindRepeatedList.call(this, observer());
        var parent;
        for(var dataItemCounter=0;dataItemCounter<observer.count;dataItemCounter++)
        {
            for(var templateKeyCounter=0;templateKeyCounter<this.__templateKeys.length;templateKeyCounter++)
            {
                var subDataItem                     = observer.observe(dataItemCounter);
                var clone                           = createTemplateCopy.call(this, this.__templateKeys[templateKeyCounter], subDataItem, dataItemCounter, retained);
                if (clone !== undefined)
                {
                    this.__repeatedControls[clone.key]  = clone.control;
                    documentFragment.appendChild(clone.control.__element);
                    parent                              = clone.parent;
                }
            }
        }
        (parent||this.__element).appendChild(documentFragment);
    }
    function unbindRepeatedList(keepList)
    {
        var retain  = [];
        if (this.__repeatedControls !== undefined)
        for(var repeatedControlKey in this.__repeatedControls)
        {
            var repeatedControl     = this.__repeatedControls[repeatedControlKey];
            if (keepList.indexOf(repeatedControl.data()) > -1)  retain.push(repeatedControl);
            else                                                {repeatedControl.data    = undefined;}
            repeatedControl.__element.parentNode.removeChild(repeatedControl.__element);
        }
        this.__repeatedControls     = {};
        return retain;
    }

    function repeater(elements, selector, parent)
    {
        control.call(this, elements, selector, parent);
        Object.defineProperties(this,
        {
            "__templateKeys":       {value: []},
            "__templateElements":   {value: {}}
        });
        this.__binder.defineDataProperties(this, {value: {set: function(value)
        {
            setTimeout
            (
                (function(data)
                {
                    bindRepeatedList.call(this, data);
                }).bind(this, (typeof(this.bind) === "function" ? value : this.data.observe(this.bind))),
                0
            );
        }}});
        this.bind   = "";
    }
    Object.defineProperty(repeater, "prototype", {value: Object.create(control.prototype)});
    Object.defineProperties(repeater.prototype,
    {
        constructor:        {value: repeater},
        init:               {value: function(definition)
        {
            extractDeferredControls.call(this, definition.repeat, this.__element);
            control.prototype.init.call(this, definition);
        }},
        children:   {value: function(){return this.__repeatedControls || null;}},
        refresh:    {value: function(){bindRepeatedList.call(this, this.data(this.__bind||""));}}
    });
    return repeater;
});}();