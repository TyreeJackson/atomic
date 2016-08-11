!function()
{"use strict";
    function __namespace(){}
    __namespace.prototype.define    = function(fullName, item) { namespace(this, fullName, item); }
    var __root                      = new __namespace();
    function getNamespace(root, paths)
    {
        var current     = root;
        for(var pathCounter=0;pathCounter<paths.length-1;pathCounter++)
        {
            var path    = paths[pathCounter];
            if (current[path] === undefined)    current[path]   = new __namespace();
            current     = current[path];
        }
        return current;
    }
    function namespace(root, fullName, value)
    {
        var paths                           = fullName.split(".");
        var namespace                       = getNamespace(root, paths);
        if (value === undefined)            return namespace[paths[paths.length-1]];
        namespace[paths[paths.length-1]]    = value;
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
    root.define("utilities.pubSub", function pubSub()
    {
        var listeners   = [];
        function _pubSub() { for(var listenerCounter=0;listenerCounter<listeners.length;listenerCounter++) listeners[listenerCounter].apply(null, arguments); }
        _pubSub.listen  = function(listener) { listeners.push(listener); }
        _pubSub.ignore  = function(listener) { root.utilities.removeFromArray.call(listeners, listener); }
        return _pubSub;
    });
    root.define("utilities.removeItemFromArray", function removeItemFromArray(array, item){ root.utilities.removeFromArray(array, array.indexOf(item)); });
}();
!function()
{"use strict";root.define("atomic.htmlAttachViewMemberAdapters", function htmlAttachViewMemberAdapters(window, document, removeItemFromArray, setTimeout, clearTimeout, each)
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
                var clone                           = this.__createTemplateCopy(this.__templateKeys[templateKeyCounter], subDataItem);
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
        this.__bindListener = (function(){ var item = this.data; if ( item(this.__bindTo||"") === undefined) return; this.data.ignore(this.__bindListener); this.__bindListener.ignore=true; delete this.__bindListener; this.bindData(item); }).bind(this);
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
    function addClass(element, className)
    {
        var classNames  = element.className.split(" ");
        if (classNames.indexOf(className) === -1) classNames.push(className);
        element.className = classNames.join(" ").trim();
    }
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
    function triggerEvent()
    {
        for(var listenerCounter=0;listenerCounter<this.listeners.length;listenerCounter++)   this.listeners[listenerCounter].apply(null, arguments);
    }
    function createElementListener(listeners)
    {
        return function() { triggerEvent.apply(listeners, arguments); };
    }
    function addListener(viewAdapter, eventName, listeners, listener, withCapture, notifyEarly)
    {
        if (listeners.elementListener === undefined)
        {
            listeners.elementListener   = createElementListener(listeners);
            viewAdapter.__element.addEventListener(eventName, listeners.elementListener, withCapture);
        }
        if (notifyEarly)    listeners.listeners.unshift(listener);
        else                listeners.listeners.push(listener);
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
        function getListeners(eventName, withCapture)
        {
            var listeners       = withCapture ? listenersUsingCapture : listenersNotUsingCapture;
            var eventListeners  = listeners[eventName];
            if (eventListeners === undefined)   eventListeners  = listeners[eventName]  = {listeners: []};
            return eventListeners;
        }

        viewAdapter.addClass                = function(className){ addClass(this.__element, className); return this;}
        viewAdapter.addClassFor             = function(className, milliseconds, onComplete){ this.addClass(className); setTimeout((function(){this.removeClass(className); if (onComplete !== undefined) onComplete();}).bind(this), milliseconds); return this;};
        viewAdapter.addEventListener        = function(eventName, listener, withCapture, notifyEarly){ addListener(this, eventName, getListeners(eventName, withCapture), listener, withCapture, notifyEarly); return this; };
        viewAdapter.addEventsListener       = function(eventNames, listener, withCapture, notifyEarly){ each(eventNames, (function(eventName){ addListener(this, eventName, getListeners(eventName, withCapture), listener, withCapture, notifyEarly); }).bind(this)); return this; };
        viewAdapter.appendControl           = function(childControl){ this.__element.appendChild(childControl.__element); };
        viewAdapter.attribute               =
        function(attributeName, value)
        {
            if (value === undefined)    return this.__element.getAttribute("data-" + attributeName);
            this.__element.setAttribute("data-" + attributeName, value);
        };
        viewAdapter.bindSourceData          = viewAdapter.__templateKeys ? bindSourceFunctions.repeater : viewAdapter.controls ? bindSourceFunctions.container : bindSourceFunctions[viewAdapter.__element.nodeName.toLowerCase() + (viewAdapter.__element.type ? ":" + viewAdapter.__element.type.toLowerCase() : "")]||bindSourceFunctions.default;
        viewAdapter.bindData                = viewAdapter.__templateKeys ? bindDataFunctions.repeater : viewAdapter.controls ? bindDataFunctions.container : bindDataFunctions.default;
        if (viewAdapter.__templateKeys)
        {
            viewAdapter.refresh = function(){ bindRepeatedList.call(this, this.data(this.__bindTo||"")); notifyOnDataUpdate.call(this, this.data(this.__bindTo||"")); };
        }
        viewAdapter.bindingRoot             = function(){return this.__bindingRoot;};
        viewAdapter.bindTo                  =
        function(value)
        {
            if(value === undefined) return this.__bindTo;
            var data    = this.data;
            if (data !== undefined) this.unbindData();
            this.__bindTo = value;
            if (data !== undefined) this.bindData(data);
            this.triggerEvent("bindToUpdated");
        };
        each(["bindSource", "bindSourceValue", "bindSourceText"],
        function(name)
        {
            viewAdapter[name]               =
            function(value)
            {
                if(value === undefined)     return this["__"+name];
                var source  = this.source;
                if (source !== undefined)   this.unbindSourceData();
                this["__"+name] = value;
                if (source !== undefined)   this.bindSourceData(source);
                this.triggerEvent(name+"Updated");
            };
        });
        viewAdapter.blur                    = function(){this.__element.blur(); return this;};
        viewAdapter.children                = function(){return this.controls || this.__repeatedControls || null;};
        viewAdapter.click                   = function(){this.__element.click(); return this;};
        viewAdapter.__detach                = function(documentFragment){this.__elementPlaceholder = document.createElement("placeholder"); this.__element.parentNode.replaceChild(this.__elementPlaceholder, this.__element); documentFragment.appendChild(this.__element); return this;};
        viewAdapter.disable                 = function(value){this.__element.disabled=!(!value);};
        viewAdapter.enable                  = function(value){this.__element.disabled=!value;};
        viewAdapter.focus                   = function(){this.__element.focus(); return this;};
        viewAdapter.for                     = function(value){ if (value === undefined) return this.__element.getAttribute("for"); this.__element.setAttribute("for", value); return this; };
        viewAdapter.hasClass                = function(className){ return hasClass(this.__element, className); }
        viewAdapter.hasFocus                = function(nested){return document.activeElement == this.__element || (nested && this.__element.contains(document.activeElement));}
        viewAdapter.height                  = function(){return this.__element.offsetHeight;}
        viewAdapter.hide                    = function(){ this.__element.style.display="none"; this.triggerEvent("hide"); return this;};
        viewAdapter.hideFor                 = function(milliseconds, onComplete){ this.hide(); setTimeout((function(){this.show(); if (onComplete !== undefined) onComplete();}).bind(this), milliseconds); return this;};
        viewAdapter.href                    = function(value){ if (value === undefined) return this.__element.href; this.__element.href=value; return this; };
        viewAdapter.id                      = function(value){ if (value === undefined) return this.__element.id; this.__element.id=value; return this; };
        viewAdapter.isDisabled              = function() { return this.__element.disabled; };
        viewAdapter.isEnabled               = function() { return !this.__element.disabled; };
        viewAdapter.insertBefore            = function(siblingControl){ siblingControl.__element.parentNode.insertBefore(this.__element, siblingControl.__element); return this; };
        viewAdapter.insertAfter             = function(siblingControl){ siblingControl.__element.parentNode.insertBefore(this.__element, siblingControl.__element.nextSibling); return this; };
        viewAdapter.onchangingdelay         = function(value){ if (value === undefined) return this.__onchangingdelay; this.__onchangingdelay = value; return this; };
        viewAdapter.removeClass             = function(className){ removeClass(this.__element, className); return this;}
        viewAdapter.removeClassFor          = function(className, milliseconds, onComplete){ this.removeClass(className); setTimeout((function(){this.addClass(className); if (onComplete !== undefined) onComplete();}).bind(this), milliseconds); return this;};
        viewAdapter.removeControl           = function(childControl){ this.__element.removeChild(childControl.__element); return this;};
        viewAdapter.removeEventListener     = function(eventName, listener, withCapture){ removeListener(this, eventName, getListeners(eventName, withCapture), listener, withCapture); return this;};
        viewAdapter.removeEventsListener    = function(eventNames, listener, withCapture){ each(eventNames, (function(eventName){ removeListener(this, eventName, getListeners(eventName, withCapture), listener, withCapture); }).bind(this)); return this;};
        viewAdapter.__reattach              = function(){this.__elementPlaceholder.parentNode.replaceChild(this.__element, this.__elementPlaceholder); delete this.__elementPlaceholder; return this;};
        if (viewAdapter.__element.nodeName.toLowerCase()=="select")
        {
            viewAdapter.count               = function() { return this.__element.options.length; }
            viewAdapter.selectedIndex       = function(value) { if (value === undefined) return this.__element.selectedIndex; this.__element.selectedIndex=value; return this; }
            viewAdapter.size                = function(value) { if (value === undefined) return this.__element.size; this.__element.size=value; return this; }
        }
        viewAdapter.show                    = function(){ this.__element.style.display=""; this.triggerEvent("show"); return this;};
        viewAdapter.showFor                 = function(milliseconds, onComplete){ this.show(); setTimeout((function(){this.hide(); if (onComplete !== undefined) onComplete();}).bind(this), milliseconds); return this;};
        viewAdapter.scrollIntoView          = function(){this.__element.scrollTop = 0; return this;};
        viewAdapter.toggleClass             = function(className, condition){ if (condition === undefined) condition = !this.hasClass(className); return this[condition?"addClass":"removeClass"](className); };
        viewAdapter.toggleEdit              = function(condition){ if (condition === undefined) condition = this.__element.getAttribute("contentEditable")!=="true"; this.__element.setAttribute("contentEditable", condition); return this;};
        viewAdapter.toggleDisplay           = function(condition){ if (condition === undefined) condition = this.__element.style.display=="none"; this[condition?"show":"hide"](); return this;};
        viewAdapter.triggerEvent            = function(eventName){ var args = Array.prototype.slice.call(arguments, 1); triggerEvent.apply(getListeners(eventName, true), args); triggerEvent.apply(getListeners(eventName, false), args); };
        viewAdapter.unbindData              = viewAdapter.__templateKeys ? unbindDataFunctions.repeater : viewAdapter.controls ? unbindDataFunctions.container : unbindDataFunctions.default;
        viewAdapter.unbindSourceData        = viewAdapter.__templateKeys ? unbindSourceFunctions.repeater : viewAdapter.controls ? unbindSourceFunctions.container : unbindSourceFunctions[viewAdapter.__element.nodeName.toLowerCase() + (viewAdapter.__element.type ? ":" + viewAdapter.__element.type.toLowerCase() : "")]||unbindSourceFunctions.default;
        viewAdapter.value                   = valueFunctions[viewAdapter.__element.nodeName.toLowerCase() + (viewAdapter.__element.type ? ":" + viewAdapter.__element.type.toLowerCase() : "")]||valueFunctions.default;
        if (viewAdapter.__element.nodeName.toLowerCase()=="input" && viewAdapter.__element.type.toLowerCase()=="text")
        {
            viewAdapter.select              = function(){this.__element.select(); return this;};
        }
        else
        {
            viewAdapter.select              = function(){selectContents(this.__element); return this; };
        }
        viewAdapter.width                   = function(){return this.__element.offsetWidth;}
        if (viewAdapterDefinition.extensions !== undefined && viewAdapterDefinition.extensions.length !== undefined)
        for(var counter=0;counter<viewAdapterDefinition.extensions.length;counter++)
        {
            if (viewAdapterDefinition.extensions[counter] === undefined) throw new Error("Extension was undefined in view adapter with element " + viewAdapter.__element.__selectorPath+"-"+viewAdapter.__selector);
            if (viewAdapterDefinition.extensions[counter].extend !== undefined) viewAdapterDefinition.extensions[counter].extend(viewAdapter);
        }
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
            function(templateKey, subDataItem)
            {
                var templateElement = this.__templateElements[templateKey];

                if (templateElement.declaration.skipItem !== undefined && templateElement.declaration.skipItem(subDataItem))    return;
                var key             = templateElement.declaration.getKey(subDataItem);
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
{"use strict";root.define("atomic.observerFactory", function(removeFromArray, isolatedFunctionFactory)
{
    var functionFactory = new isolatedFunctionFactory();
    var subObserver                                 =
    functionFactory.create
    (function subObserverFactory(basePath, bag, isArray)
    {
        function subObserver(path, value)
        {
            return subObserver.__invoke(path, value);
        }
        Object.defineProperty(subObserver, "__basePath", {get:function(){return basePath;}});
        Object.defineProperty(subObserver, "__bag", {get:function(){return bag;}});
        if (isArray)
        {
            Object.defineProperty(subObserver, "push", {get:function(){return function(item){ var items = this(); items.push(item); this.__notify(this.__basePath, items); }}});
            Object.defineProperty(subObserver, "pop", {get:function(){return function(){ var items = this(); items.pop(); this.__notify(this.__basePath, items); }}});
            Object.defineProperty(subObserver, "shift", {get:function(){return function(item){ var items = this(); items.shift(item); this.__notify(this.__basePath, items); }}});
            Object.defineProperty(subObserver, "unshift", {get:function(){return function(){ var items = this(); items.unshift(); this.__notify(this.__basePath, items); }}});
            Object.defineProperty(subObserver, "sort", {get:function(){return function(sorter){ var items = this(); items.sort(sorter); this.__notify(this.__basePath, items); }}});
            Object.defineProperty(subObserver, "remove", {get:function(){return function(item){ this.__remove(item); }}});
            Object.defineProperty(subObserver, "removeAll", {get:function(){return function(items){ this.__removeAll(items); }}});
            Object.defineProperty(subObserver, "join", {get:function(){return function(separator){ var items = this(); return items.join(separator); }}});
        }
        else
        {
            Object.defineProperty(subObserver, "isDefined", {get:function(){return function(propertyName){return this(propertyName)!==undefined;}}})
            Object.defineProperty(subObserver, "hasValue", {get:function(){return function(propertyName){var value=this(propertyName); return value!==undefined && value;}}})
        }
        //Object.defineProperty(subObserver, "toString", {get:function(){debugger; throw new Error("You shouldn't be here.");}});
        return subObserver;
    });
    function getValue(pathSegments, revisedPath)
    {
        pathSegments    = pathSegments || [""];
        if (this.__bag.updating.length > 0 && pathSegments.length > 0) addProperties(this.__bag.updating[this.__bag.updating.length-1].properties, pathSegments);
        var returnValue = navDataPath(this.__bag, pathSegments);
        if (revisedPath !== undefined && returnValue !== null && typeof returnValue == "object") return new subObserver(revisedPath, this.__bag, Array.isArray(returnValue));
        return returnValue;
    }
    functionFactory.root.prototype.__invoke         =
    function(path, value)
    {
        if (path === undefined && value === undefined)  return getValue.call(this, extractPathSegments(this.__basePath));
        if (path === undefined || path === null)        path    = "";
        var pathSegments    = extractPathSegments(this.__basePath+"."+path.toString());
        var revisedPath     = getFullPath(pathSegments);
        if (value === undefined)    return getValue.call(this, pathSegments, revisedPath);
        if (this.__bag.rollingback) return;
        var currentValue = navDataPath(this.__bag, pathSegments);
        if (value !== currentValue)
        {
            navDataPath(this.__bag, pathSegments, value);
            notifyPropertyListeners.call(this, revisedPath, value, this.__bag);
        }
    }
    functionFactory.root.prototype.basePath         = function(){return this.__basePath;};
    functionFactory.root.prototype.__remove         =
    function(value)
    {
        var items   = this();
        if (!Array.isArray(items))  throw new Error("Observer does not wrap an Array.");
        removeFromArray(items, items.indexOf(value));
        this.__notify(this.__basePath, items);
    }
    functionFactory.root.prototype.__removeAll      =
    function(values)
    {
        var items   = this();
        var keepers = [];
        if (!Array.isArray(items))  throw new Error("Observer does not wrap an Array.");
        for(var itemCounter=0;itemCounter<items.length;itemCounter++)
        {
            var item    = items[itemCounter];
            if (values.indexOf(item) == -1) keepers.push(item);
        }
        items.length = 0;
        items.push.apply(items, keepers);
        this.__notify(this.__basePath, items);
    }
    functionFactory.root.prototype.__notify         =
    function(path, value)
    {
        notifyPropertyListeners.call(this, path, value, this.__bag);
    }
    functionFactory.root.prototype.listen           =
    function(callback)
    {
        var listener    = {callback: callback};
        this.__bag.itemListeners.push(listener);
        notifyPropertyListener.call(this, "", listener, this.__bag);
    }
    functionFactory.root.prototype.ignore           =
    function(callback)
    {
        for(var listenerCounter=0;listenerCounter<this.__bag.itemListeners.length;listenerCounter++)
        if (this.__bag.itemListeners[listenerCounter].callback === callback)
        removeFromArray(this.__bag.itemListeners, listenerCounter);
    }
    functionFactory.root.prototype.beginTransaction =
    function()
    {
        this.__bag.backup   = JSON.parse(JSON.stringify(this.__bag.item));
    }
    functionFactory.root.prototype.commit           =
    function()
    {
        delete this.__bag.backup;
    }
    functionFactory.root.prototype.rollback         =
    function()
    {
        this.__bag.rollingback  = true;
        this.__bag.item         = this.__bag.backup;
        delete this.__bag.backup;
        notifyPropertyListeners.call(this, this.__basePath, this.__bag.item, this.__bag);
        this.__bag.rollingback  = false;
    }
    function extractArrayPathSegmentsInto(subSegments, returnSegments, path)
    {
        for(var subSegmentCounter=0;subSegmentCounter<subSegments.length;subSegmentCounter++)
        {
            var subSegment  = subSegments[subSegmentCounter];
            // warning: string subsegments are not currently supported
            if (isNaN(subSegment))  { debugger; throw new Error("An error occured while attempting to parse a array subSegment index in the path " + path); }
            returnSegments.push({type:1, value: parseInt(subSegment)});
        }
    }
    function extractPathSegments(path)
    {
        var pathSegments    = path.split(".");
        var returnSegments  = [];
        for(var segmentCounter=0;segmentCounter<pathSegments.length;segmentCounter++)
        {
            var pathSegment = pathSegments[segmentCounter];
            var bracket     = pathSegment.indexOf("[");
            if (bracket > -1)
            {
                var subSegments = pathSegment.substring(bracket+1, pathSegment.length-1).split("][");
                pathSegment     = pathSegment.substring(0, bracket);
                if (pathSegment !=="")   returnSegments.push({type:1, value: pathSegment});
                extractArrayPathSegmentsInto(subSegments, returnSegments, path);
            }
            else    if (pathSegment !=="")   returnSegments.push({type:0, value: pathSegment});
        }
        return returnSegments;
    }
    function getFullPath(paths)
    {
        if (paths.length == 0) return "";
        var path    = paths[0].value;
        for(var pathCounter=1;pathCounter<paths.length;pathCounter++)   path    += "." + paths[pathCounter].value;
        return path;
    }
    function navDataPath(root, paths, value)
    {
        if (paths.length == 0)
        {
            if(value === undefined) return root.item;
            root.item   = value;
            return;
        }
        var current     = root.item;
        for(var pathCounter=0;pathCounter<paths.length-1;pathCounter++)
        {
            var path    = paths[pathCounter];
            if (current[path.value] === undefined)
            {
                if (value !== undefined)    current[path.value]   = path.type===0?{}:[];
                else                        return undefined;
            }
            current     = current[path.value];
        }
        if (value === undefined)    return current[paths[paths.length-1].value];
        current[paths[paths.length-1].value]    = value;
    }
    function addPropertyPath(properties, path, remainingPath)
    {
        properties[path]    = remainingPath !== undefined ? remainingPath : "";
    }
    function addProperties(properties, pathSegments)
    {
        addPropertyPath(properties, "", getFullPath(pathSegments.slice(0)));
        var path    = pathSegments[0].value;
        addPropertyPath(properties, path, getFullPath(pathSegments.slice(1)));
        for(var segmentCounter=1;segmentCounter<pathSegments.length;segmentCounter++)
        {
            path    += "." + pathSegments[segmentCounter].value;
            addPropertyPath(properties, path, getFullPath(pathSegments.slice(segmentCounter+1)));
        }
    }
    function notifyPropertyListener(propertyKey, listener, bag)
    {
        if (listener.callback !== undefined && !listener.callback.ignore && (propertyKey == "" || (listener.properties !== undefined && listener.properties.hasOwnProperty(propertyKey))))
        {
            bag.updating.push(listener);
            listener.properties = {};
            var postCallback = listener.callback();
            bag.updating.pop();
            if (postCallback !== undefined) postCallback();
        }
    }
    function notifyPropertyListeners(propertyKey, value, bag)
    {
        var itemListeners   = bag.itemListeners.slice();
        for(var listenerCounter=0;listenerCounter<itemListeners.length;listenerCounter++)   notifyPropertyListener.call(this, propertyKey, itemListeners[listenerCounter], bag);
    }
    return function observer(_item)
    {
        var bag             =
        {
            item:           _item,
            itemListeners:  [],
            propertyKeys:   [],
            updating:       [],
            rollingback:    false
        };
        return new subObserver("", bag, Array.isArray(_item));
    };
});}();
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
                    root.utilities.each
                ),
                new root.atomic.initializeViewAdapter(root.utilities.each),
                root.utilities.pubSub,
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
            viewElement||document.body
        );
        adapter.bindData(new atomic.observer({}));
        adapter.bindSourceData(new atomic.observer({}));
        if (typeof callback === "function") callback(adapter);
    }
    if (document.readyState !== "complete") window.addEventListener("load", deferOrExecute);
    else                                    deferOrExecute();

    return function(callbackFunction){ callback = callbackFunction; };
});}(window, document);