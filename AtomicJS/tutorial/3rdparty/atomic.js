!function()
{"use strict";
    function __namespace() {}
    function define(fullName, item) { namespace(this, fullName, item); }
    Object.defineProperty(__namespace.prototype, "define", {value:define});
    var __root  = new __namespace();
    function getNamespace(root, paths)
    {
        var current     = root;
        for(var pathCounter=0;pathCounter<paths.length-1;pathCounter++)
        {
            var path    = paths[pathCounter];
            if (current[path] === undefined)    Object.defineProperty(current, path, {value: new __namespace()});
            current     = current[path];
        }
        return current;
    }
    function namespace(root, fullName, value)
    {
        var paths                   = fullName.split(".");
        var namespace               = getNamespace(root, paths);
        if (value === undefined)    return namespace[paths[paths.length-1]];
        Object.defineProperty(namespace, [paths[paths.length-1]], {value: value});
    }
    window.root = window.root || __root;
}();
!function()
{"use strict";
    root.define("utilities.each", function each(array, callback) { for(var arrayCounter=0;arrayCounter<array.length;arrayCounter++) callback(array[arrayCounter], arrayCounter); });
    root.define("utilities.removeFromArray", function removeFromArray(array, from, to)
    {
        var rest        = array.slice((to || from) + 1 || array.length);
        array.length    = from < 0 ? array.length + from : from;
        return array.push.apply(array, rest);
    });
    root.define("utilities.pubSub", function pubSub(isolatedFunctionFactory, removeFromArray)
    {
        var functionFactory = new isolatedFunctionFactory();
        var pubSub          =
        functionFactory.create
        {
            {
                {
    });
    root.define("utilities.removeItemFromArray", function removeItemFromArray(array, item){ root.utilities.removeFromArray(array, array.indexOf(item)); });
}();
!function()
{
        });
    }
    {
        {
            {
    function bindRepeatedList(observer)
    {
        if (observer === undefined) return;
        var documentFragment    = document.createDocumentFragment();
        var source              = this.source;
        unbindRepeatedList.call(this);
        for(var dataItemCounter=0;dataItemCounter<observer().length;dataItemCounter++)
        {
            var subDataItem = observer(dataItemCounter);
            for(var templateKeyCounter=0;templateKeyCounter<this.__templateKeys.length;templateKeyCounter++)
            {
                var clone                           = this.__createTemplateCopy(this.__templateKeys[templateKeyCounter], subDataItem, dataItemCounter);
                if (clone !== undefined)
                {
                    this.__repeatedControls[clone.key]  = clone.control;
                    clone.control.bindData(subDataItem);
                    documentFragment.appendChild(clone.control.__element);
                }
            }
        }
        if (source !== undefined)   this.bindSourceData(source);
        this.__element.appendChild(documentFragment);
    }
    function unbindRepeatedList()
    {
        this.unbindSourceData();
        if (this.__repeatedControls !== undefined)
        for(var repeatedControlKey in this.__repeatedControls)
        {
            var repeatedControl     = this.__repeatedControls[repeatedControlKey];
            repeatedControl.unbindData();
            repeatedControl.__element.parentNode.removeChild(repeatedControl.__element);
        }
        this.__repeatedControls     = {};
    }
    function notifyOnbind(data) { if (this.__onbind) this.__onbind(data); }
    function notifyOnDataUpdate(data) { if (this.__ondataupdate) this.__ondataupdate(data); }
    function notifyOnSourceUpdate(data) { if (this.__onsourceupdate) this.__onsourceupdate(data); }
    function notifyOnunbind(data) { if (this.__onunbind) this.__onunbind(data); }
    function notifyOnbindSource(data) { if (this.__onbindsource) this.__onbindsource(data); }
    function notifyOnunbindSource(data) { if (this.__onunbindsource) this.__onunbindsource(data); }
    function clearSelectList(selectList){ for(var counter=selectList.options.length-1;counter>=0;counter--) selectList.remove(counter); }
    function bindSelectListSource()
    {
        var selectedValue   = this.value();
        var isArray         = Array.isArray(typeof selectedValue === "function" ? selectedValue() : selectedValue);
        clearSelectList(this.__element);
        var source          = this.source(this.__bindSource||"");
        if (source === undefined)   return;
        for(var counter=0;counter<source().length;counter++)
        {
            var option      = document.createElement('option');
            var sourceItem  = source()[counter];
            option.text     = this.__bindSourceText !== undefined ? sourceItem[this.__bindSourceText] : sourceItem;
            if (!isArray)   option.selected = (option.rawValue = this.__bindSourceValue !== undefined ? sourceItem[this.__bindSourceValue] : sourceItem) == selectedValue;
            else            option.selected = selectedValue.indexOf(option.rawValue = this.__bindSourceValue !== undefined ? sourceItem[this.__bindSourceValue] : sourceItem) > -1;
            this.__element.appendChild(option);
        }
    }
    function clearRadioGroup(radioGroup){ for(var counter=radioGroup.childNodes.length-1;counter>=0;counter--) radioGroup.removeChild(radioGroup.childNodes[counter]); }
    function bindRadioGroupSource()
    {
        var selectedValue   = this.value();
        clearRadioGroup(this.__element);
        var source          = this.source(this.__bindSource||"");
        if (source === undefined)   return;
        for(var counter=0;counter<source().length;counter++)
        {
            var radioGroupItem                      = this.__templateElement.cloneNode(true);
            var sourceItem                          = source()[counter];
            radioGroupItem.parent                   = this;
            radioGroupItem.__radioElement           = radioGroupItem.querySelector(this.__radioButtonSelector);
            radioGroupItem.__radioLabel             = radioGroupItem.querySelector(this.__radioLabelSelector);
            radioGroupItem.__radioLabel.addEventListener("click", (function(){this.parent.value(this.__radioElement.rawValue);this.parent.triggerEvent("change");}).bind(radioGroupItem),false)
            radioGroupItem.__radioElement.name      = this.__element.__selectorPath + (this.__element.id||"unknown");
            radioGroupItem.__radioElement.checked   = (radioGroupItem.__radioElement.rawValue  = this.__bindSourceValue !== undefined ? sourceItem[this.__bindSourceValue] : sourceItem) == selectedValue;
            if(radioGroupItem.__radioLabel) radioGroupItem.__radioLabel.innerHTML   = this.__bindSourceText !== undefined ? sourceItem[this.__bindSourceText] : sourceItem;
            this.__element.appendChild(radioGroupItem);
        }
    }
    function deferSourceBinding()
    {
        this.__bindSourceListener   = (function(){ var item = this.source; if (item(this.__bindSource||"") === undefined) return; this.source.ignore(this.__bindSourceListener); this.__bindSourceListener.ignore=true; delete this.__bindSourceListener; this.bindSourceData(item); }).bind(this);
        this.source.listen(this.__bindSourceListener);
        return this;
    }
    function bindSourceContainerChildren()
    {
        for(var controlKey in this.controls)    if (!this.controls[controlKey].__bindingRoot) this.controls[controlKey].bindSourceData(this.source(this.__bindSource||""));
        this.__bindSourceListener   = (function(){ notifyOnSourceUpdate.call(this, this.source(this.__bindSource||"")); }).bind(this);
        this.source.listen(this.__bindSourceListener);
        notifyOnbindSource.call(this, this.source);
        return this;
    }
    function bindSourceRepeaterChildren()
    {
        for(var controlKey in this.__repeatedControls)    this.__repeatedControls[controlKey].bindSourceData(this.source(this.__bindSource||""));
        this.__bindSourceListener   = (function(){ notifyOnSourceUpdate.call(this, this.source(this.__bindSource||"")); }).bind(this);
        this.source.listen(this.__bindSourceListener);
        notifyOnbindSource.call(this, this.source);
        return this;
    }
    function bindSourceSelectList()
    {
        this.__bindSourceListener   = (function(){ bindSelectListSource.call(this); notifyOnSourceUpdate.call(this, this.source); }).bind(this);
        this.source.listen(this.__bindSourceListener);
        notifyOnbindSource.call(this, this.source);
        return this;
    }
    function bindSourceRadioGroup()
    {
        if (this.__templateElement === undefined)
        {
            this.__radioButtonSelector	= this.__element.getAttribute("data-atomic-radiobutton")||"input[type='radio']";
            this.__radioLabelSelector   = this.__element.getAttribute("data-atomic-radiolabel")||"label";
            this.__templateElement      = this.__element.querySelector("radiogroupitem");
            this.__templateElement.parentNode.removeChild(this.__templateElement);
            clearRadioGroup(this.__element);
        }
        this.__bindSourceListener   = (function(){ bindRadioGroupSource.call(this); notifyOnSourceUpdate.call(this, this.source); }).bind(this);
        this.source.listen(this.__bindSourceListener);
    }
    function deferSourceBindingCheck(sources, bindSourceFunction)
    {
        if (sources !== undefined)
        {
            this.source = sources;
            if (this.source(this.__bindSource||"") === undefined)   return deferSourceBinding.call(this);
            else                                                    return bindSourceFunction !== undefined ? bindSourceFunction.call(this) : this;
        }
        return this;
    }
    var bindSourceFunctions     =
    {
        "default":                  function(sources){ return deferSourceBindingCheck.call(this, sources); },
        "container":                function(sources){ return deferSourceBindingCheck.call(this, sources, bindSourceContainerChildren); },
        "repeater":                 function(sources){ return deferSourceBindingCheck.call(this, sources, bindSourceRepeaterChildren); },
        "select:select-multiple":   function(sources){ return deferSourceBindingCheck.call(this, sources, bindSourceSelectList); },
        "select:select-one":        function(sources){ return deferSourceBindingCheck.call(this, sources, bindSourceSelectList); },
        "radiogroup":               function(sources){ return deferSourceBindingCheck.call(this, sources, bindSourceRadioGroup); }
    };
    function unbindSources(extendedUnbindFunction)
    {
        if (this.source !== undefined)                  this.source.ignore(this.__bindSourceListener);
        if (this.__bindSourceListener !== undefined)    this.__bindSourceListener.ignore    = true;
        delete this.__bindSourceListener;
        delete this.source;
        if (extendedUnbindFunction !== undefined)       extendedUnbindFunction.call(this);
        return this;
    }
    var unbindSourceFunctions   =
    {
        "default":                  function(){ return unbindSources.call(this); },
        "container":                function(){ return unbindSources.call(this, function(){ for(var controlKey in this.controls) if (!this.controls[controlKey].__bindingRoot) this.controls[controlKey].unbindSourceData(); }); },
        "repeater":                 function(){ return unbindSources.call(this, function(){ for(var controlKey in this.__repeatedControls)  this.__repeatedControls[controlKey].unbindSourceData(); }); },
        "select:select-multiple":   function(){ return unbindSources.call(this, function(){ clearSelectList(this.__element); }); },
        "select:select-one":        function(){ return unbindSources.call(this, function(){ clearSelectList(this.__element); }); },
        "radiogroup":               function(){ return unbindSources.call(this, function(){ if (this.__templateElement !== undefined) clearRadioGroup(this.__element); }); }
    };
    function bindUpdateEvents()
    {
        if (this.__updateon===undefined)
        {
            this.addEventListener("change", this.__inputListener, false, true);
            return;
        }
        for(var eventNameCounter=0;eventNameCounter<this.__updateon.length;eventNameCounter++)  this.addEventListener(this.__updateon[eventNameCounter], this.__inputListener, false, true);
    }
    function unbindUpdateEvents()
    {
        if (this.__updateon===undefined)
        {
            this.removeEventListener("change", this.__inputListener, false, true);
            return;
        }
        for(var eventNameCounter=0;eventNameCounter<this.__updateon.length;eventNameCounter++)  this.removeEventListener(this.__updateon[eventNameCounter], this.__inputListener, false, true);
    }
    function deferBinding()
    {
        this.data.listen(this.__bindListener);
        return this;
    }
    function bindDefault()
    {
        this.__bindListener     = (function(){ var value = this.data(this.__bindTo); if (!this.__notifyingObserver) this.value(value, true); notifyOnDataUpdate.call(this, this.data); }).bind(this);
        this.data.listen(this.__bindListener);
        notifyOnbind.call(this, this.data);
        return this;
    }
    function bindContainerChildren()
    {
        for(var controlKey in this.controls)    if (!this.controls[controlKey].__bindingRoot) this.controls[controlKey].bindData(this.data(this.__bindTo||""));
        this.__bindListener = (function(){ if (this.data === undefined) throw new Error("This control is not currently bound."); notifyOnDataUpdate.call(this, this.data(this.__bindTo||"")); }).bind(this);
        this.data.listen(this.__bindListener);
        notifyOnbind.call(this, this.data);
        return this;
    }
    function bindRepeaterChildren()
    {
        this.__bindListener = (function(){ var item = this.data(this.__bindTo||""); return (function(){ bindRepeatedList.call(this, item); notifyOnDataUpdate.call(this, item); }).bind(this); }).bind(this);
        this.data.listen(this.__bindListener);
        notifyOnbind.call(this, this.data);
        return this;
    }
    function deferBindingCheck(observer, bindFunction)
    {
        if (observer === undefined) throw new Error("Unable to bind container control to an undefined observer");
        this.data   = observer;
        if (this.data(this.__bindTo||"") === undefined) return deferBinding.call(this);
        else                                            return bindFunction.call(this);
    }
    var bindDataFunctions  =
    {
        "default":
        function(observer)
        {
            if (observer === undefined) throw new Error("Unable to bind container control to an undefined observer");
            this.data                       = observer;
            if (this.__bindTo !== undefined || this.__bindAs)
            {
                if(this.__bindAs)
                {
                    this.__bindListener     = (function(){var value = this.__bindAs(this.__bindTo !== undefined ? this.data(this.__bindTo) : this.data); if (!this.__notifyingObserver) this.value(value, true); notifyOnDataUpdate.call(this, this.data); }).bind(this);
                    this.data.listen(this.__bindListener);
                    notifyOnbind.call(this, this.data);
                }
                else
                {
                    this.__inputListener    = (function(){this.__notifyingObserver=true; this.data(this.__bindTo, this.value()); this.__notifyingObserver=false;}).bind(this);
                    bindUpdateEvents.call(this);

                    if (this.data(this.__bindTo||"") === undefined) return deferBinding.call(this);
                    else                                            return bindDefault.call(this);
                }
            }
            else if (this.__ondataupdate)
            {
                this.__bindListener     = (function(){ notifyOnDataUpdate.call(this, this.data); }).bind(this);
                this.data.listen(this.__bindListener);
                notifyOnbind.call(this, this.data);
            }
            return this;
        },
        container:        function(observer){ return deferBindingCheck.call(this, observer, bindContainerChildren); },
        repeater:         function(observer){ return deferBindingCheck.call(this, observer, bindRepeaterChildren); }
    };
    function unbindData(extendedUnbindFunction)
    {
        if (this.data !== undefined)            this.data.ignore(this.__bindListener);
        if (this.__bindListener !== undefined)  this.__bindListener.ignore  = true;
        delete this.__bindListener;
        delete this.data;
        if (extendedUnbindFunction !== undefined)   extendedUnbindFunction.call(this);
        return this;
    }
    var unbindDataFunctions  =
    {
        "default":
        function()
        {
            if (this.data === undefined)                        return this;

            if (this.__bindTo !== undefined || this.__bindAs)
            {
                return unbindData.call(this, function()
                {
                    unbindUpdateEvents.call(this);
                    delete this.__inputListener;
                    notifyOnunbind.call(this);
                });
            }
            else if (this.__ondataupdate)                       return unbindData.call(this, function(){ notifyOnunbind.call(this); });
        },
        container:
        function()
        {
            return unbindData.call(this, function()
            {
                for(var controlKey in this.controls) if (!this.controls[controlKey].__bindingRoot) this.controls[controlKey].unbindData();
                notifyOnunbind.call(this);
            });
        },
        repeater:
        function()
        {
            return unbindData.call(this, function()
            {
                var documentFragment    = document.createDocumentFragment();
                this.__detach(documentFragment);
                unbindRepeatedList.call(this);
                this.__reattach();
                notifyOnunbind.call(this);
            });
        }
    };
    function htmlBasedValueFunc(value, forceSet)
    {
        if (value !== undefined || forceSet)    this.__element.innerHTML=value;
        else                                    return this.__element.innerHTML;
    }
    function setSelectListValue(value)
    {
        this.__rawValue = value;
        if (this.__element.options.length > 0) for(var counter=0;counter<this.__element.options.length;counter++) this.__element.options[counter].selected = this.__element.options[counter].rawValue == value;
    }
    function setSelectListValues(values)
    {
        if (typeof values === "function")   values = values();
        if ( !Array.isArray(values)) values  = [values];
        this.__rawValue = values;
        if (this.__element.options.length > 0) for(var counter=0;counter<this.__element.options.length;counter++) this.__element.options[counter].selected = values.indexOf(this.__element.options[counter].rawValue) > -1;
    }
    function getSelectListValue()
    {
        if (this.__element.options.length > 0) for(var counter=0;counter<this.__element.options.length;counter++) if (this.__element.options[counter].selected)   return this.__rawValue = this.__element.options[counter].rawValue;
        return this.__rawValue;
    }
    function getSelectListValues()
    {
        if (this.__element.options.length == 0) return this.__rawValue;
        var values  = [];
        if (this.__element.options.length > 0) for(var counter=0;counter<this.__element.options.length;counter++) if (this.__element.options[counter].selected)   values.push(this.__element.options[counter].rawValue);
        return this.__rawValue = values;
    }
    function setRadioGroupValue(value)
    {
        this.__rawValue = value;
        if (this.__templateElement !== undefined && this.__element.childNodes.length > 0) for(var counter=0;counter<this.__element.childNodes.length;counter++) this.__element.childNodes[counter].__radioElement.checked = this.__element.childNodes[counter].__radioElement.rawValue == value;
    }
    function getRadioGroupValue()
    {
        if (this.__templateElement !== undefined && this.__element.childNodes.length > 0) for(var counter=0;counter<this.__element.childNodes.length;counter++) if (this.__element.childNodes[counter].__radioElement.checked)  return this.rawValue = this.__element.childNodes[counter].__radioElement.rawValue;
        return this.__rawValue;
    }
    var valueFunctions          =
    {
        "default":
        function(value, forceSet)
        {
            if (value !== undefined || forceSet)    this.__element.value    = value;
            else                                    return this.__element.value;
        },
        "input:checkbox":
        function(value, forceSet)
        {
            if (value !== undefined || forceSet)    this.__element.checked  = value===true;
            else                                    return this.__element.checked;
        },
        "img":
        function(value, forceSet)
        {
            if (value !== undefined || forceSet)    this.__element.src  = value;
            else                                    return this.__element.src;
        },
        "select:select-multiple":
        function(value, forceSet)
        {
            if (value !== undefined || forceSet)    setSelectListValues.call(this, value);
            else                                    return getSelectListValues.call(this);
        },
        "select:select-one":
        function(value, forceSet)
        {
            if (value !== undefined || forceSet)    setSelectListValue.call(this, value);
            else                                    return getSelectListValue.call(this);
        },
        "radiogroup":
        function(value, forceSet)
        {
            if (value !== undefined || forceSet)    setRadioGroupValue.call(this, value);
            else                                    return getRadioGroupValue.call(this);
        }
    };
    each(["a","abbr","address","article","aside","b","bdi","blockquote","body","caption","cite","code","col","colgroup","dd","del","details","dfn","dialog","div","dl","dt","em","fieldset","figcaption","figure","footer","h1","h2","h3","h4","h5","h6","header","i","ins","kbd","label","legend","li","menu","main","mark","menuitem","meter","nav","ol","optgroup","p","pre","q","rp","rt","ruby","section","s","samp","small","span","strong","sub","summary","sup","table","tbody","td","tfoot","th","thead","time","title","tr","u","ul","wbr"],
    function(name)
    {
        valueFunctions[name]    = htmlBasedValueFunc;
    });
    function hasClass(element, className)
    {
        var classNames  = element.className.split(" ");
        return classNames.indexOf(className) > -1;
    }
    function removeClass(element, className)
    {
        if (className === undefined)
        {
            element.className   = "";
            return;
        }
        var classNames  = element.className.split(" ");
        if (classNames.indexOf(className) > -1) removeItemFromArray(classNames, className);
        element.className = classNames.join(" ");
    }
    function removeListener(viewAdapter, eventName, listeners, listener, withCapture)
    {
        if (listeners.elementListener !== undefined)
        {
            removeItemFromArray(listeners.listeners, listener);
            if (listeners.listeners.length === 0)
            {
                viewAdapter.__element.removeEventListener(eventName, listeners.elementListener, withCapture);
                delete listeners.elementListener;
            }
        }
    }
    function selectContents(element)
    {
        var range = document.createRange();
        range.selectNodeContents(element);
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }
    return function(viewAdapter, viewAdapterDefinition)
    {
        var listenersUsingCapture           = {};
        var listenersNotUsingCapture        = {};

    };
});}();
!function()
{"use strict";root.define("atomic.initializeViewAdapter", function(each)
{
    function cancelEvent(event)
    {
        event.preventDefault();
        event.stopPropagation();
        return false;
    }
    function notifyIfValueHasChanged(callback)
    {
        this.__lastChangingTimeout  = undefined;
        callback.call(this, this.__lastChangingValueSeen);
    }
    
    function notifyIfValueHasChangedOrDelay(callback)
    {
        if ((this.__lastChangingValueSeen||"") === this.value())  return;
        this.__lastChangingValueSeen = this.value();
        if (this.__onchangingdelay !== undefined)
        {
            if (this.__lastChangingTimeout !== undefined)   clearTimeout(this.__lastChangingTimeout);
            this.__lastChangingTimeout  = setTimeout(notifyIfValueHasChanged.bind(this, callback), this.__onchangingdelay);
        }
        else    notifyIfValueHasChanged.call(this, callback);
    }
    var initializers    =
    {
        onchangingdelay:    function(viewAdapter, value)    { viewAdapter.onchangingdelay(parseInt(value)); },
        onchanging:         function(viewAdapter, callback) { viewAdapter.addEventsListener(["keydown", "keyup", "mouseup", "touchend", "change"], notifyIfValueHasChangedOrDelay.bind(viewAdapter, callback), false, true); },
        onenter:            function(viewAdapter, callback) { viewAdapter.addEventListener("keypress", function(event){ if (event.keyCode==13) { callback.call(viewAdapter); return cancelEvent(event); } }, false, true); },
        onescape:           function(viewAdapter, callback) { viewAdapter.addEventListener("keydown", function(event){ if (event.keyCode==27) { callback.call(viewAdapter); return cancelEvent(event); } }, false, true); },
        hidden:             function(viewAdapter, value)    { if (value) viewAdapter.hide(); },
        focused:            function(viewAdapter, value)    { if (value) viewAdapter.focus(); }
    };
    each(["bindData", "bindSource", "bindSourceData", "bindSourceValue", "bindSourceText", "bindTo", "value"], function(val){ initializers[val] = function(viewAdapter, value) { viewAdapter[val](value); }; });
    each(["bindAs", "bindingRoot", "onbind", "onbindsource", "ondataupdate", "onsourceupdate", "onunbind", "updateon"], function(val){ initializers[val] = function(viewAdapter, value) { viewAdapter["__" + val] = value; }; });
    each(["show", "hide"], function(val){ initializers["on"+val] = function(viewAdapter, callback) { viewAdapter.addEventListener(val, function(event){ callback.call(viewAdapter); }, false, true); }; });
    each(["blur", "change", "click", "contextmenu", "copy", "cut", "dblclick", "drag", "drageend", "dragenter", "dragleave", "dragover", "dragstart", "drop", "focus", "focusin", "focusout", "input", "keydown", "keypress", "keyup", "mousedown", "mouseenter", "mouseleave", "mousemove", "mouseover", "mouseout", "mouseup", "paste", "search", "select", "touchcancel", "touchend", "touchmove", "touchstart", "wheel"], function(val){ initializers["on" + val] = function(viewAdapter, callback) { viewAdapter.addEventListener(val, callback.bind(viewAdapter), false); }; });

    function initializeViewAdapterExtension(viewAdapter, viewAdapterDefinition, extension)
    {
        for(var initializerSetKey in extension.initializers)
        if (viewAdapterDefinition.hasOwnProperty(initializerSetKey))
        {
            var initializerSet  = viewAdapterDefinition[initializerSetKey];
            for(var initializerKey in extension.initializers[initializerSetKey])
            if (initializerSet.hasOwnProperty(initializerKey))   extension.initializers[initializerSetKey][initializerKey](viewAdapter, viewAdapterDefinition[initializerSetKey][initializerKey]);
        }
    }

    return function initializeViewAdapter(viewAdapter, viewAdapterDefinition)
    {
        for(var initializerKey in initializers)
        if (viewAdapterDefinition.hasOwnProperty(initializerKey))    initializers[initializerKey](viewAdapter, viewAdapterDefinition[initializerKey]);

        if (viewAdapter.__extensions !== undefined && viewAdapter.__extensions.length !== undefined)
        for(var counter=0;counter<viewAdapter.__extensions.length;counter++)  initializeViewAdapterExtension(viewAdapter, viewAdapterDefinition, viewAdapter.__extensions[counter]);
        delete viewAdapter.__extensions;
    };
});}();
!function()
{"use strict";root.define("atomic.isolatedFunctionFactory", function isolatedFunctionFactory(document)
{
    return function()
    {
        var iframe              = document.createElement("iframe");
        iframe.style.display    = "none";
        document.body.appendChild(iframe);
        var isolatedDocument    = frames[frames.length - 1].document;
        isolatedDocument.write("<script>parent.__isolatedFunction = Function;<\/script>");
        var isolatedFunction    = window.__isolatedFunction;
        delete window.__isolatedFunction;
 return {
            create:
            function(functionToIsolate)
            {
                isolatedDocument.write("<script>parent.__isolatedSubFunction = " + functionToIsolate.toString() + ";<\/script>");
                var __isolatedSubFunction  = window.__isolatedSubFunction;
                delete window.__isolatedSubFunction;
                return __isolatedSubFunction;
            },
            root:   isolatedFunction
        };
    }
});}();
!function()
{"use strict";root.define("atomic.htmlViewAdapterFactorySupport", function htmlViewAdapterFactorySupport(document, attachViewMemberAdapters, initializeViewAdapter, pubSub, logger)
{
    var typeHintMap         = {};
    var missingElements;
    var querySelector       =
    function(uiElement, selector, selectorPath, typeHint)
    {
        var element = uiElement.querySelector(selector);
        if (element === null)
        {
            logger("Element for selector " + selector + " was not found in " + (uiElement.id?("#"+uiElement.id):("."+uiElement.className)));
            element                 = document.createElement(typeHint!==undefined?(typeHintMap[typeHint]||typeHint):"div");
            var label               = document.createElement("span");
            label.innerHTML         = (selectorPath||"") + "-" + selector + ":";
            var container           = document.createElement("div");
            missingElements         = missingElements||createMissingElementsContainer();
            container.appendChild(element);
            missingElements.appendChild(label);
            missingElements.appendChild(container);
            element.style.border    = "solid 1px black";
        }
        element.__selectorPath  = selectorPath;
        return element;
    };
    var querySelectorAll    =
    function(uiElement, selector, selectorPath, typeHint)
    {
        return uiElement.querySelectorAll(selector);
    };
    function createMissingElementsContainer()
    {
        var missingElements = document.createElement("div");
        document.body.appendChild(missingElements);
        return missingElements;
    }
    function removeAllElementChildren(element)
    {
        while(element.lastChild)    element.removeChild(element.lastChild);
    }
    function getSelectorPath(viewAdapter)
    {
        return viewAdapter === undefined ? "" : getSelectorPath(viewAdapter.parent) + "-" + (viewAdapter.__selector||"root");
    }
    var internalFunctions   =
    {
        addEvents:
        function(viewAdapter, eventNames)
        {
            viewAdapter.on  = {};
            if (eventNames)
            for(var eventNameCounter=0;eventNameCounter<eventNames.length;eventNameCounter++)   viewAdapter.on[eventNames[eventNameCounter]]   = new pubSub();
        },
        addCustomMembers:
        function(viewAdapter, members)
        {
            for(var memberKey in members) viewAdapter[memberKey]    = members[memberKey].bind(viewAdapter);
        },
        attachControls:
        function (viewAdapter, controlDeclarations, viewElement)
        {
            if (controlDeclarations === undefined)  return;
            var selectorPath            = getSelectorPath(viewAdapter);
            viewAdapter.__controlKeys   = [];
            viewAdapter.controls        = {};
            for(var controlKey in controlDeclarations)
            {
                viewAdapter.__controlKeys.push(controlKey);
                var declaration = controlDeclarations[controlKey];
                var selector    = (declaration.selector||("#"+controlKey));
                if (declaration.multipresent)
                {
                    var elements    = querySelectorAll(viewElement, selector, selectorPath);
                    for(var elementCounter=0;elementCounter<elements.length;elementCounter++)
                    viewAdapter.controls[controlKey+elementCounter] = this.createControl(declaration, elements[elementCounter], viewAdapter, selector);
                }
                else    viewAdapter.controls[controlKey] = this.createControl(declaration, querySelector(viewElement, selector, selectorPath), viewAdapter, selector);
            }
        },
        createControl:
        function(controlDeclaration, controlElement, parent, selector)
        {
            var control;
            if (controlDeclaration.factory !== undefined)
            {
                control = controlDeclaration.factory(parent, controlElement, selector);
            }
            else    control = this.create(controlDeclaration.adapter||function(){ return controlDeclaration; }, controlElement, parent, selector);
            initializeViewAdapter(control, controlDeclaration);
            if(controlDeclaration.multipresent){Object.defineProperty(control, "multipresent", {writable: false, value:true});}
            return control;
        },
        extractDeferredControls:
        function(viewAdapter, templateDeclarations, viewElement)
        {
            if (templateDeclarations === undefined) return;
            viewAdapter.__templateKeys          = [];
            viewAdapter.__templateElements      = {};
            viewAdapter.__createTemplateCopy    =
            function(templateKey, subDataItem, counter)
            {
                var templateElement = this.__templateElements[templateKey];

                if (templateElement.declaration.skipItem !== undefined && templateElement.declaration.skipItem(subDataItem))    return;
                var key             = templateElement.declaration.getKey.call({parent: viewAdapter, index: counter}, subDataItem);
                var elementCopy     = templateElement.element.cloneNode(true);
                elementCopy.setAttribute("id", key);
                return { key: key, parent: templateElement.parent, control: internalFunctions.createControl(templateElement.declaration, elementCopy, viewAdapter, "#" + key) };
            };
            for(var templateKey in templateDeclarations)
            {
                viewAdapter.__templateKeys.push(templateKey);
                var templateDeclaration                         = templateDeclarations[templateKey];
                var templateElement                             = querySelector(viewElement, (templateDeclaration.selector||("#"+templateKey)), getSelectorPath(viewAdapter));
                var templateElementParent                       = templateElement.parentNode;
                templateElementParent.removeChild(templateElement);
                viewAdapter.__templateElements[templateKey]     =
                {
                    parent:         templateElementParent,
                    declaration:    templateDeclaration,
                    element:        templateElement
                };
            }
            for(var templateKey in templateDeclarations)
            removeAllElementChildren(viewAdapter.__templateElements[templateKey].parent);
        },
        create:
        function createViewAdapter(viewAdapterDefinitionConstructor, viewElement, parent, selector)
        {
            var viewAdapter             = {__element: viewElement, __selector: selector, parent: parent};
            var viewAdapterDefinition   = new viewAdapterDefinitionConstructor(viewAdapter);
            this.attachControls(viewAdapter, viewAdapterDefinition.controls, viewElement);
            this.extractDeferredControls(viewAdapter, viewAdapterDefinition.repeat, viewElement);
            attachViewMemberAdapters(viewAdapter, viewAdapterDefinition);
            this.addEvents(viewAdapter, viewAdapterDefinition.events);
            this.addCustomMembers(viewAdapter, viewAdapterDefinition.members);

            viewAdapter.addControl  =
            function(controlKey, controlDeclaration)
            {
                if (controlDeclaration === undefined)  return;
                viewAdapter.__controlKeys           = viewAdapter.__controlKeys || [];
                viewAdapter.controls                = viewAdapter.controls      || {};
                viewAdapter.__controlKeys.push(controlKey);
                viewAdapter.controls[controlKey]    = internalFunctions.createControl(controlDeclaration, undefined, viewAdapter, "#" + controlKey);
                viewAdapter.controls[controlKey].__element.setAttribute("id", controlKey);
                return viewAdapter.controls[controlKey];
            }

            if(viewAdapter.construct)   viewAdapter.construct(viewAdapter);
            if(viewAdapterDefinition.extensions !== undefined)  viewAdapter.__extensions    = viewAdapterDefinition.extensions;
            return viewAdapter;
        }
    };
    return internalFunctions;
});}();
!function()
{"use strict";root.define("atomic.viewAdapterFactory", function(internalFunctions)
{
return {
        create:         function createViewAdapter(viewAdapterDefinitionConstructor, viewElement, parent) { return internalFunctions.create(viewAdapterDefinitionConstructor, viewElement, parent, (viewElement.id?("#"+viewElement.id):("."+viewElement.className))); },
        createFactory:  function createFactory(viewAdapterDefinitionConstructor, viewElementTemplate, selector)
        {
            viewElementTemplate.parentNode.removeChild(viewElementTemplate);
            return (function(parent, containerElement, containerSelector)
            {
                var container   = parent;
                if (containerElement !== undefined)
                {
                    container                       = internalFunctions.create(function(){return {};}, containerElement, parent, selector);
                    container.__element.innerHTML   = "";
                }
                var view                            = internalFunctions.create(viewAdapterDefinitionConstructor, viewElementTemplate.cloneNode(true), container, selector);
                container.appendControl(view);
                return view;
            }).bind(this);
        }
    };
});}();
!function()
{
        {
        }
        }
        {
        }
        }
        {
        }
        {
        }
        {
            {
            }
        }
        {
        }
        {
            {
            {
            }
        }
        {
        }
        {
        }
    }
    {
        {
        };
        {
            {
            }
!function()
{"use strict";root.define("atomic.htmlCompositionRoot", function htmlCompositionRoot()
{
return {
        viewAdapterFactory:
        new root.atomic.viewAdapterFactory
        (
            new root.atomic.htmlViewAdapterFactorySupport
            (
                document,
                new root.atomic.htmlAttachViewMemberAdapters
                (
                    window,
                    document,
                    root.utilities.removeItemFromArray,
                    window.setTimeout,
                    window.clearTimeout,
                ),
                new root.atomic.initializeViewAdapter(root.utilities.each),
                function(message){console.log(message);}
            )
        ),
        observer:
        new root.atomic.observerFactory(root.utilities.removeFromArray, new root.atomic.isolatedFunctionFactory(document))
    }
});}();
!function(window, document)
{"use strict";root.define("atomic.adaptHtml", function adaptHtml(viewElement, controlsOrAdapter)
{
    if (arguments.length == 1)
    {
        controlsOrAdapter   = viewElement;
        viewElement         = document.body;
    }
    var callback;
    var deferOrExecute  =
    function()
    {
        var atomic  = root.atomic.htmlCompositionRoot();
        var adapter =
        atomic.viewAdapterFactory.create
        (
            typeof controlsOrAdapter !== "function" ? function(appViewAdapter){return {controls: controlsOrAdapter}; } : controlsOrAdapter, 
        );
        adapter.bindData(new atomic.observer({}));
        adapter.bindSourceData(new atomic.observer({}));
        if (typeof callback === "function") callback(adapter);
    }
    if (document.readyState !== "complete") window.addEventListener("load", deferOrExecute);
    else                                    deferOrExecute();

    return function(callbackFunction){ callback = callbackFunction; };
});}(window, document);