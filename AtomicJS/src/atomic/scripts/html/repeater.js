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
    function locate(item, templateKey, retained)
    {
        var retainedArray   = retained[templateKey];
        if (retainedArray === undefined)    return null;
        for(var counter=0;counter<retainedArray.length;counter++) if ( retainedArray[counter].data() === item)
        {
            var retainedControl = retainedArray[counter];
            removeFromArray(retainedArray, counter);
            return retainedControl;
        }
        return null;
    }
    function createTemplateCopy(templateKey, subDataItem, counter, retained)
    {
        var templateElement = this.__templateElements[templateKey];
        if (templateElement.declaration.skipItem !== undefined && templateElement.declaration.skipItem(subDataItem))    return;
        var key             = templateElement.declaration.getKey.call({parent: this, index: counter}, subDataItem);
        var originalPath    = subDataItem("$path");

        var retainedControl = locate(subDataItem(), templateKey, retained);
        if (retainedControl !== null)
        {
            retainedControl.__element.setAttribute("id", key);
            retainedControl.__element.setAttribute("data-current-path", originalPath);
            return { key: key, parent: templateElement.parent, control: retainedControl };
        }

        var elementCopy     = templateElement.element.cloneNode(true);
        elementCopy.setAttribute("id", key);
        elementCopy.setAttribute("data-original-path", originalPath);
        var clone           = { key: key, parent: templateElement.parent, control: this.createControl(templateElement.declaration, elementCopy, this, "#" + key) };
        Object.defineProperty(clone.control, "__templateKey", {value: templateKey});
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
        var retain  = {};
        if (this.__repeatedControls !== undefined)
        for(var repeatedControlKey in this.__repeatedControls)
        {
            var repeatedControl     = this.__repeatedControls[repeatedControlKey];
            if (retain[repeatedControl.__templateKey] === undefined)    retain[repeatedControl.__templateKey]   = [];
            repeatedControl.__element.parentNode.removeChild(repeatedControl.__element);
            if (keepList.indexOf(repeatedControl.data()) > -1)          retain[repeatedControl.__templateKey].push(repeatedControl);
            else                                                        {repeatedControl.destroy();}
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
            if (this.__updateDataOnChildControlsTimeoutId !== undefined)    clearTimeout(this.__updateDataOnChildControlsTimeoutId);
            this.__updateDataOnChildControlsTimeoutId   =
            setTimeout
            (
                (function(data)
                {
                    delete  this.__updateDataOnChildControlsTimeoutId;
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
        refresh:    {value: function(){bindRepeatedList.call(this, this.data(this.__bind||""));}},
        pageSize:   {get: function(){return this.__pageSize;}, set: function(value){this.__pageSize = value;}}
    });
    return repeater;
});}();