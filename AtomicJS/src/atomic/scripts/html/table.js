!function(){"use strict";root.define("atomic.html.table", function htmlTable(control, removeFromArray)
{
    var querySelector       =
    function(uiElement, selector, selectorPath, typeHint)
    {
        return uiElement.querySelector(selector)||document.createElement(typeHint);
    };
    function removeAllElementChildren(element)
    {
        while(element.lastChild)    element.removeChild(element.lastChild);
    }
    function extractDeferredControls(headerDeclaration, rowDeclaration, cellDeclaration, viewElement)
    {
        if (headerDeclaration !== undefined)
        {
            var headerElement                               = querySelector(viewElement, (headerDeclaration.selector||("thead>tr>th")), this.getSelectorPath(), "th");
            var headerElementParent                         = headerElement.parentNode;
            if (headerElementParent !== null)               headerElementParent.removeChild(headerElement);
            Object.defineProperty(this, "__header", { value:
            { 
                declaration:    headerDeclaration,
                element:        headerElement,
                parentElement:  headerElementParent
            }});
        }
        if (cellDeclaration !== undefined)
        {
            var cellElement                                 = querySelector(viewElement, (cellDeclaration.selector||("tbody>tr>td")), this.getSelectorPath(), "td");
            var rowElement                                  = cellElement.parentNode;
            var rowElementParent                            = rowElement.parentNode;
            rowElement.removeChild(cellElement);
            if (rowElementParent !== null)                  rowElementParent.removeChild(rowElement);
            Object.defineProperty(this, "__cell", { value:
            { 
                declaration:    cellDeclaration,
                cellElement:    cellElement,
                rowDeclaration: rowDeclaration,
                rowElement:     rowElement,
                parentElement:  rowElementParent
            }});
        }
        removeAllElementChildren(this.__header.parentElement);
        removeAllElementChildren(this.__cell.parentElement);
    }
    function removeListItem(itemIndex)
    {
        var templateKey     = "row_" + itemIndex;
        var repeatedControl = this.__repeatedRows[templateKey];
        if (repeatedControl !== undefined)
        {
            this.__retained[templateKey]    = repeatedControl;
            repeatedControl.__element.parentNode.removeChild(repeatedControl.__element);
            repeatedControl.__setData(null);
            delete this.__repeatedRows[templateKey];
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
    function addListItem(itemIndex, documentFragment)
    {
        var clone       = getTemplateCopy.call(this, itemIndex);
        if (clone !== undefined)
        {
            this.__repeatedRows["row_" + itemIndex] = clone.control;
            documentFragment.appendChild(clone.control.__element);
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
    function createTemplateCopy(itemIndex, itemKey)
    {
        var elementCopy = this.__cell.rowElement.cloneNode(true);
        elementCopy.setAttribute("id", itemKey);
        var bindPath    = this.__rows.__basePath;
        var clone       = { key: itemKey, control: this.createControl(this.__cell.rowDeclarations, elementCopy, "#" + itemKey, itemKey, "row", bindPath + (bindPath.length > 0 ? "." : "") + itemIndex) };
        Object.defineProperty(clone.control, "__templateKey", {value: "row"});
        //console.log("created: " + clone.control.__selector)
        return clone;
    }
    function getTemplateCopy(itemIndex)
    {
        var itemKey         = "row_"+itemIndex;
        var template        = this.__cell;
        var retainedControl = getRetainedTemplateCopy.call(this, itemKey);
        var clone           = retainedControl !== null ? { key: itemKey, parent: template.parentElement, control: retainedControl } : createTemplateCopy.call(this, itemIndex, itemKey);
        var data            = this.__getData();
        if (data !== undefined) clone.control.__setData(data);
        return clone;
    };
    function discardRetained()
    {
        this.__trash.push(this.__retained);
        Object.defineProperty(this, "__itemCount", {value: 0, configurable: true});
        Object.defineProperty(this, "__retained", {value: {}, configurable: true});
    }
    function refreshTable(forceRefresh)
    {
        var itemCount   = this.__rows != undefined ? this.__rows("length")||0 : 0;
        if (isNaN(itemCount) || itemCount === (this.__itemCount) || this.__headerCount === 0)   return;
        if (forceRefresh)   discardRetained.call(this);
        if (this.__itemCount < itemCount)
        {
            var documentFragment    = document.createDocumentFragment();
            for(var counter=this.__itemCount;counter<itemCount;counter++)   addListItem.call(this, counter, documentFragment);
            this.__setViewData("callback", function() { this.__cell.parentElement.appendChild(documentFragment); });
        }
        else if (this.__itemCount > itemCount)
        {
            for(var counter=this.__itemCount-1;counter>=itemCount;counter--)   removeListItem.call(this, counter);
            resetGarbageCollector.call(this);
        }
        Object.defineProperty(this, "__itemCount", {value: itemCount, configurable: true});
    }
    function refreshLayout()
    {
        var headerCount = this.__headers != undefined ? this.__headers("length")||0 : 0;
        if (isNaN(headerCount) || headerCount === (this.__headerCount)) return;
        removeAllElementChildren(this.__header.parentElement);

        var headerDeclarations      = {selector: "thead > tr", bind: this.headers.bind, controls: {}};
        this.__cell.rowDeclarations = {bind: this.__cell.rowDeclaration.bind, on: this.__cell.rowDeclaration.on, controls: {}};
        for(var counter=0;counter < this.__headers("length"); counter++)
        {
            headerDeclarations.controls["header_"+counter] = {bind: counter.toString(), controls: this.__header.declaration};
            var newNode = this.__header.element.cloneNode(true);
            newNode.id  = "header_"+counter;
            this.__header.parentElement.appendChild(newNode);

            this.__cell.rowDeclarations.controls["cell_" + counter] = {bind: counter.toString(), controls: this.__cell.declaration};
            var newNode = this.__cell.cellElement.cloneNode(true);
            newNode.id  = "cell_"+counter;
            this.__cell.rowElement.appendChild(newNode);
        }
        this.attachControls({header: headerDeclarations});
        Object.defineProperty(this, "__headerCount", {value: headerCount, configurable: true});
        refreshTable.call(this, true);
    }
    function table(elements, selector, parent, bindPath, childKey, protoChildKey)
    {
        control.call(this, elements, selector, parent, bindPath, childKey, protoChildKey);
        Object.defineProperties(this,
        {
            __headerRowCells:       {value: [], configurable: true},
            __templateContainers:   {value: {}, configurable: true},
            __retained:             {value: {}, configurable: true},
            __trash:                {value: [], configurable: true},
            __itemCount:            {value: 0, configurable: true},
            __headerCount:          {value: 0, configurable: true},
            __repeatedRows:         {value: {}, configurable: true}
        });
        this.__binder.defineDataProperties(this,
        {
            headers:    {get: function(){return this.__headers;},   set: function(value){this.__headers = value; refreshLayout.call(this);}, simpleBindingsOnly: true},
            rows:       {get: function(){return this.__rows;},      set: function(value){this.__rows = value; refreshTable.call(this);}, simpleBindingsOnly: true}
        });
        this.value.listen({bind: ""});
    }
    Object.defineProperty(table, "prototype", {value: Object.create(control.prototype)});
    Object.defineProperty(table, "__getViewProperty", {value: function(name) { return control.__getViewProperty(name); }});
    Object.defineProperties(table.prototype,
    {
        constructor:                {value: table},
        frame:                      {value: function(controlDefinition, initializerDefinition)
        {
            extractDeferredControls.call(this, controlDefinition.header, controlDefinition.row, controlDefinition.cell, this.__element);
            control.prototype.frame.call(this, controlDefinition, initializerDefinition);
        }},
        children:   {get: function(){return this.__repeatedRows || null;}},
        pageSize:   {get: function(){return this.__pageSize;}, set: function(value){this.__pageSize = value;}}
    });
    return table;
});}();