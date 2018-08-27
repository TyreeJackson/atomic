!function(){"use strict";root.define("atomic.html.repeater", function htmlRepeater(control, removeFromArray)
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
    function extractDeferredControls(templateDeclarations, viewElement)
    {
        if (templateDeclarations === undefined) return;
        for(var templateKey in templateDeclarations)
        {
            this.__templateKeys.push(templateKey);
            var templateDeclaration                         = templateDeclarations[templateKey];
            var templateElement                             = querySelector(viewElement, (templateDeclaration.selector||("#"+templateKey)), this.getSelectorPath());
            var templateElementParent                       = templateElement.parentNode;
            if (templateElementParent !== null)             templateElementParent.removeChild(templateElement);
            this.__templateContainers[templateKey]          = templateElementParent;
            this.__templates[templateKey]                   =
            {
                parent:         templateElementParent||viewElement,
                declaration:    templateDeclaration,
                element:        templateElement
            };
        }
        for(var templateKey in templateDeclarations)
        {
            removeAllElementChildren(this.__templates[templateKey].parent);
        }
    }
    function removeListItem(itemIndex)
    {
        for(var templateKeyCounter=0;templateKeyCounter<this.__templateKeys.length;templateKeyCounter++)
        {
            var templateKey     = this.__templateKeys[templateKeyCounter] + "_" + itemIndex;
            var repeatedControl = this.__repeatedControls[templateKey];
            if (repeatedControl !== undefined)
            {
                this.__retained[templateKey]    = repeatedControl;
                repeatedControl.__element.parentNode.removeChild(repeatedControl.__element);
                repeatedControl.__setData(null);
                delete this.__repeatedControls[templateKey];
            }
        }
        this.getEvents("viewupdated").viewupdated(["innerHTML"]);
    }
    function collectGarbage()
    {
        var garbage     = this.__retained;
        Object.defineProperty(this, "__retained", {});
        var keys        = Object.keys(garbage);
        var keyCounter  = keys.length-1;
        function collectGarbagePage()
        {
            var lowerBound  = keyCounter-10 > -1 ? keyCounter - 10 : -1;
            for(var counter=keyCounter;counter>lowerBound;counter--)
            {
                var key = keys[counter];
                //console.log("Collected: " + garbage[key].__selector);
                garbage[key].destroy();
                delete  garbage[key];
            }
            keyCounter      = lowerBound;
            if (keyCounter > 0) setTimeout(collectGarbagePage, 10);
        }
        collectGarbagePage();
    }
    function resetGarbageCollector()
    {
        if (this.__gcID !== undefined)
        {
            clearTimeout(this.__gcID);
            Object.defineProperty(this, "__gcID", {writable: true, configurable: true});
            delete this.__gcID;
        }
        Object.defineProperty(this, "__gcID", {value: setTimeout(collectGarbage.bind(this), 180000), configurable: true});
    }
    function addListItem(itemIndex, documentFragments)
    {
        for(var templateKeyCounter=0;templateKeyCounter<this.__templateKeys.length;templateKeyCounter++)
        {
            var templateKey = this.__templateKeys[templateKeyCounter];
            var clone       = getTemplateCopy.call(this, templateKey, itemIndex);
            if (clone !== undefined)
            {
                this.__repeatedControls[templateKey + "_" + itemIndex]  = clone.control;
                documentFragments[templateKey].appendChild(clone.control.__element);
                parent                              = clone.parent;
            }
        }
        this.getEvents("viewupdated").viewupdated(["innerHTML"]);
    }
    function getRetainedTemplateCopy(itemKey)
    {
        if (this.__retained[itemKey])
        {
            var item    = this.__retained[itemKey];
            delete this.__retained[itemKey];
            //console.log("recycled: " + item.__selector)
            return item;
        }
        return null;
    }
    function createTemplateCopy(templateKey, template, itemIndex, itemKey)
    {
        var elementCopy = template.element.cloneNode(true);
        elementCopy.setAttribute("id", itemKey);
        var bindPath    = this.bindPath + (this.bindPath.length > 0 && this.__extendedBindPath.length > 0 ? "." : "") + this.__extendedBindPath;
        var clone       = { key: itemKey, parent: template.parent, control: this.createControl(template.declaration, elementCopy, "#" + itemKey, itemKey, templateKey, bindPath + (bindPath.length > 0 ? "." : "") + itemIndex) };
        Object.defineProperty(clone.control, "__templateKey", {value: templateKey});
        //console.log("created: " + clone.control.__selector)
        return clone;
    }
    function getTemplateCopy(templateKey, itemIndex)
    {
        var itemKey         = templateKey+"_"+itemIndex;
        var template        = this.__templates[templateKey];
        var retainedControl = getRetainedTemplateCopy.call(this, itemKey);
        var clone           = retainedControl !== null ? { key: itemKey, parent: template.parent, control: retainedControl } : createTemplateCopy.call(this, templateKey, template, itemIndex, itemKey);
        var data            = this.__getData();
        if (data !== undefined) clone.control.__setData(data);
        return clone;
    };
    function refreshList(itemCount)
    {
        itemCount   = itemCount||0;
        if (isNaN(itemCount) || itemCount === (this.__itemCount))    return;
        if (this.__itemCount > itemCount)
        {
            for(var counter=this.__itemCount-1;counter>=itemCount;counter--)   removeListItem.call(this, counter);
            resetGarbageCollector.call(this);
        }
        else if (this.__itemCount < itemCount)
        {
            var documentFragments   = createTemplateContainerDocumentFragments.call(this);
            for(var counter=this.__itemCount;counter<itemCount;counter++)   addListItem.call(this, counter, documentFragments.byKey);
            attachTemplateContainerDocumentFragments.call(this, documentFragments);
        }
        Object.defineProperty(this, "__itemCount", {value: itemCount, configurable: true});
    }
    function getSharedTemplateContainerKey(templateKey)
    {
        var templateContainer   = this.__templateContainers[templateKey];
        for(var counter=0;counter<this.__templateKeys.length;counter++)
        {
            var compareKey  = this.__templateKeys[counter];
            if (compareKey == templateKey)                                  return null;
            if (this.__templateContainers[compareKey] == templateContainer) return compareKey;
        }
    }
    function createTemplateContainerDocumentFragments()
    {
        var documentFragments                           = {byKey: {}, unique: {}};
        for(var counter=0;counter<this.__templateKeys.length;counter++)
        {
            var templateKey                             = this.__templateKeys[counter];
            var sharedContainerKey                      = getSharedTemplateContainerKey.call(this, templateKey);
            if (sharedContainerKey == null)
            {
                var documentFragment                    = document.createDocumentFragment();
                documentFragments.byKey[templateKey]    = documentFragment;
                documentFragments.unique[templateKey]   = documentFragment;
            }
            else
            {
                documentFragments.byKey[templateKey]    = documentFragments.byKey[sharedContainerKey];
            }
        }
        return documentFragments;
    }
    function attachTemplateContainerDocumentFragments(documentFragments)
    {
        this.__setViewData("callback", function()
        {for(var counter=0;counter<this.__templateKeys.length;counter++)
        {
            var templateKey = this.__templateKeys[counter];
            delete documentFragments.byKey[templateKey];
            if(documentFragments.unique[templateKey])
            {
                this.__templateContainers[templateKey].appendChild(documentFragments.unique[templateKey]);
                delete documentFragments.unique[templateKey];
            }
        }});
    }
    function repeater(elements, selector, parent, bindPath, childKey, protoChildKey)
    {
        control.call(this, elements, selector, parent, bindPath, childKey, protoChildKey);
        Object.defineProperties(this,
        {
            __templateKeys:         {value: [], configurable: true},
            __templates:            {value: {}, configurable: true},
            __templateContainers:   {value: {}, configurable: true},
            __retained:             {value: {}, configurable: true},
            __itemCount:            {value: 0, configurable: true},
            __repeatedControls:     {value: {}, configurable: true}
        });
        this.__binder.defineDataProperties(this,
        {
            value:  {get: function(){return this.__value;}, set: function(value){this.__value = value; refreshList.call(this, value!=undefined&&value.isObserver?value().length:0);}, simpleBindingsOnly: true}
        });
        this.value.listen({bind: ""});
    }
    Object.defineProperty(repeater, "prototype", {value: Object.create(control.prototype)});
    Object.defineProperty(repeater, "__getViewProperty", {value: function(name) { return control.__getViewProperty(name); }});
    Object.defineProperties(repeater.prototype,
    {
        constructor:                {value: repeater},
        frame:                      {value: function(definition)
        {
            extractDeferredControls.call(this, definition.repeat, this.__element);
            control.prototype.frame.call(this, definition);
        }},
        children:   {get: function(){return this.__repeatedControls || null;}},
        pageSize:   {get: function(){return this.__pageSize;}, set: function(value){this.__pageSize = value;}}
    });
    return repeater;
});}();