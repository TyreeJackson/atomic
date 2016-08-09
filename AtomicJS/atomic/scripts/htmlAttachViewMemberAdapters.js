!function()
{"use strict";root.define("atomic.htmlAttachViewMemberAdapters", function htmlAttachViewMemberAdapters(window, document, removeItemFromArray, setTimeout, clearTimeout, each)
{
    function bindRepeatedList(observer)
    {
        if (observer === undefined) return;
        var documentFragment    = document.createDocumentFragment();
        var sourceData          = this.boundSource;
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
        if (sourceData !== undefined)   this.bindSourceData(sourceData);
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
    function notifyOnboundedUpdate(data) { if (this.__onboundedupdate) this.__onboundedupdate(data); }
    function notifyOnboundedSourceUpdate(data) { if (this.__onboundedsourceupdate) this.__onboundedsourceupdate(data); }
    function notifyOnunbind(data) { if (this.__onunbind) this.__onunbind(data); }
    function notifyOnbindSource(data) { if (this.__onbindsource) this.__onbindsource(data); }
    function notifyOnunbindSource(data) { if (this.__onunbindsource) this.__onunbindsource(data); }
    function clearSelectList(selectList){ for(var counter=selectList.options.length-1;counter>=0;counter--) selectList.remove(counter); }
    function bindSelectListSource()
    {
        var selectedValue   = this.value();
        clearSelectList(this.__element);
        var source          = this.boundSource(this.__bindSource||"");
        if (source === undefined)   return;
        for(var counter=0;counter<source().length;counter++)
        {
            var option      = document.createElement('option');
            var sourceItem  = source()[counter];
            option.text     = this.__bindSourceText !== undefined ? sourceItem[this.__bindSourceText] : sourceItem;
            option.selected = (option.rawValue = this.__bindSourceValue !== undefined ? sourceItem[this.__bindSourceValue] : sourceItem) == selectedValue;
            this.__element.appendChild(option);
        }
    }
    function clearRadioGroup(radioGroup){ for(var counter=radioGroup.childNodes.length-1;counter>=0;counter--) radioGroup.removeChild(radioGroup.childNodes[counter]); }
    function bindRadioGroupSource()
    {
        var selectedValue   = this.value();
        clearRadioGroup(this.__element);
        var source          = this.boundSource(this.__bindSource||"");
        if (source === undefined)   return;
        for(var counter=0;counter<source().length;counter++)
        {
            var radioGroupItem                      = this.__templateElement.cloneNode(true);
            var sourceItem                          = source()[counter];
            radioGroupItem.__radioElement           = radioGroupItem.querySelector(this.__radioButtonSelector);
            radioGroupItem.__radioLabel             = radioGroupItem.querySelector(this.__radioLabelSelector);
            radioGroupItem.__radioElement.name      = this.__element.__selectorPath + (this.__element.id||"unknown");
            radioGroupItem.__radioElement.checked   = (radioGroupItem.__radioElement.rawValue  = this.__bindSourceValue !== undefined ? sourceItem[this.__bindSourceValue] : sourceItem) == selectedValue;
            if(radioGroupItem.__radioLabel) radioGroupItem.__radioLabel.innerHTML   = this.__bindSourceText !== undefined ? sourceItem[this.__bindSourceText] : sourceItem;
            this.__element.appendChild(radioGroupItem);
        }
    }
    function deferSourceBinding()
    {
        this.__bindSourceListener   = (function(){ var item = this.boundSource; if (item(this.__bindSource||"") === undefined) return; this.boundSource.ignore(this.__bindSourceListener); this.__bindSourceListener.ignore=true; delete this.__bindSourceListener; this.bindSourceData(item); }).bind(this);
        this.boundSource.listen(this.__bindSourceListener);
        return this;
    }
    function bindSourceContainerChildren()
    {
        for(var controlKey in this.controls)    if (!this.controls[controlKey].__bindingRoot) this.controls[controlKey].bindSourceData(this.boundSource(this.__bindSource||""));
        this.__bindSourceListener   = (function(){ notifyOnboundedSourceUpdate.call(this, this.boundSource(this.__bindSource||"")); }).bind(this);
        this.boundSource.listen(this.__bindSourceListener);
        notifyOnbindSource.call(this, this.boundSource);
        return this;
    }
    function bindSourceRepeaterChildren()
    {
        for(var controlKey in this.__repeatedControls)    this.__repeatedControls[controlKey].bindSourceData(this.boundSource(this.__bindSource||""));
        this.__bindSourceListener   = (function(){ notifyOnboundedSourceUpdate.call(this, this.boundSource(this.__bindSource||"")); }).bind(this);
        this.boundSource.listen(this.__bindSourceListener);
        notifyOnbindSource.call(this, this.boundSource);
        return this;
    }
    function bindSourceSelectList()
    {
        this.__bindSourceListener   = (function(){ bindSelectListSource.call(this); notifyOnboundedSourceUpdate.call(this, this.boundSource); }).bind(this);
        this.boundSource.listen(this.__bindSourceListener);
        notifyOnbindSource.call(this, this.boundSource);
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
        this.__bindSourceListener   = (function(){ bindRadioGroupSource.call(this); notifyOnboundedSourceUpdate.call(this, this.boundSource); }).bind(this);
        this.boundSource.listen(this.__bindSourceListener);
    }
    function deferSourceBindingCheck(sources, bindSourceFunction)
    {
        if (sources !== undefined)
        {
            this.boundSource            = sources;
            if (this.boundSource(this.__bindSource||"") === undefined)  return deferSourceBinding.call(this);
            else                                                        return bindSourceFunction !== undefined ? bindSourceFunction.call(this) : this;
        }
        return this;
    }
    var bindSourceFunctions     =
    {
        "default":              function(sources){ return deferSourceBindingCheck.call(this, sources); },
        "container":            function(sources){ return deferSourceBindingCheck.call(this, sources, bindSourceContainerChildren); },
        "repeater":             function(sources){ return deferSourceBindingCheck.call(this, sources, bindSourceRepeaterChildren); },
        "select:select-one":    function(sources){ return deferSourceBindingCheck.call(this, sources, bindSourceSelectList); },
        "radiogroup":           function(sources){ return deferSourceBindingCheck.call(this, sources, bindSourceRadioGroup); }
    };
    function unbindSources(extendedUnbindFunction)
    {
        if (this.boundSource !== undefined)             this.boundSource.ignore(this.__bindSourceListener);
        if (this.__bindSourceListener !== undefined)    this.__bindSourceListener.ignore    = true;
        delete this.__bindSourceListener;
        delete this.boundSource;
        if (extendedUnbindFunction !== undefined)       extendedUnbindFunction.call(this);
        return this;
    }
    var unbindSourceFunctions   =
    {
        "default":              function(){ return unbindSources.call(this); },
        "container":            function(){ return unbindSources.call(this, function(){ for(var controlKey in this.controls) if (!this.controls[controlKey].__bindingRoot) this.controls[controlKey].unbindSourceData(); }); },
        "repeater":             function(){ return unbindSources.call(this, function(){ for(var controlKey in this.__repeatedControls)  this.__repeatedControls[controlKey].unbindSourceData(); }); },
        "select:select-one":    function(){ return unbindSources.call(this, function(){ clearSelectList(this.__element); }); },
        "radiogroup":           function(){ return unbindSources.call(this, function(){ if (this.__templateElement !== undefined) clearRadioGroup(this.__element); }); }
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
        this.__bindListener = (function(){ var item = this.boundItem; if ( item(this.__bindTo||"") === undefined) return; this.boundItem.ignore(this.__bindListener); this.__bindListener.ignore=true; delete this.__bindListener; this.bindData(item); }).bind(this);
        this.boundItem.listen(this.__bindListener);
        return this;
    }
    function bindDefault()
    {
        this.__bindListener     = (function(){ var value = this.boundItem(this.__bindTo); if (!this.__notifyingObserver) this.value(value, true); notifyOnboundedUpdate.call(this, this.boundItem); }).bind(this);
        this.boundItem.listen(this.__bindListener);
        notifyOnbind.call(this, this.boundItem);
        return this;
    }
    function bindContainerChildren()
    {
        for(var controlKey in this.controls)    if (!this.controls[controlKey].__bindingRoot) this.controls[controlKey].bindData(this.boundItem(this.__bindTo||""));
        this.__bindListener = (function(){ if (this.boundItem === undefined) throw new Error("This control is not currently bound."); notifyOnboundedUpdate.call(this, this.boundItem(this.__bindTo||"")); }).bind(this);
        this.boundItem.listen(this.__bindListener);
        notifyOnbind.call(this, this.boundItem);
        return this;
    }
    function bindRepeaterChildren()
    {
        this.__bindListener = (function(){ var item = this.boundItem(this.__bindTo||""); return (function(){ bindRepeatedList.call(this, item); notifyOnboundedUpdate.call(this, item); }).bind(this); }).bind(this);
        this.boundItem.listen(this.__bindListener);
        notifyOnbind.call(this, this.boundItem);
        return this;
    }
    function deferBindingCheck(observer, bindFunction)
    {
        if (observer === undefined) throw new Error("Unable to bind container control to an undefined observer");
        this.boundItem  = observer;
        if (this.boundItem(this.__bindTo||"") === undefined)    return deferBinding.call(this);
        else                                                    return bindFunction.call(this);
    }
    var bindDataFunctions  =
    {
        "default":
        function(observer)
        {
            if (observer === undefined) throw new Error("Unable to bind container control to an undefined observer");
            this.boundItem          = observer;
            if (this.__bindTo !== undefined || this.__bindAs)
            {
                if(this.__bindAs)
                {
                    this.__bindListener     = (function(){var value = this.__bindAs(this.__bindTo !== undefined ? this.boundItem(this.__bindTo) : this.boundItem); if (!this.__notifyingObserver) this.value(value, true); notifyOnboundedUpdate.call(this, this.boundItem); }).bind(this);
                    this.boundItem.listen(this.__bindListener);
                    notifyOnbind.call(this, this.boundItem);
                }
                else
                {
                    this.__inputListener    = (function(){this.__notifyingObserver=true; this.boundItem(this.__bindTo, this.value()); this.__notifyingObserver=false;}).bind(this);
                    bindUpdateEvents.call(this);

                    if (this.boundItem(this.__bindTo||"") === undefined)    return deferBinding.call(this);
                    else                                                    return bindDefault.call(this);
                }
            }
            else if (this.__onboundedupdate)
            {
                this.__bindListener     = (function(){ notifyOnboundedUpdate.call(this, this.boundItem); }).bind(this);
                this.boundItem.listen(this.__bindListener);
                notifyOnbind.call(this, this.boundItem);
            }
            return this;
        },
        container:        function(observer){ return deferBindingCheck.call(this, observer, bindContainerChildren); },
        repeater:         function(observer){ return deferBindingCheck.call(this, observer, bindRepeaterChildren); }
    };
    function unbindData(extendedUnbindFunction)
    {
        if (this.boundItem !== undefined)       this.boundItem.ignore(this.__bindListener);
        if (this.__bindListener !== undefined)  this.__bindListener.ignore  = true;
        delete this.__bindListener;
        delete this.boundItem;
        if (extendedUnbindFunction !== undefined)   extendedUnbindFunction.call(this);
        return this;
    }
    var unbindDataFunctions  =
    {
        "default":
        function()
        {
            if (this.boundItem === undefined)                   return this;

            if (this.__bindTo !== undefined || this.__bindAs)
            {
                return unbindData.call(this, function()
                {
                    unbindUpdateEvents.call(this);
                    delete this.__inputListener;
                    notifyOnunbind.call(this);
                });
            }
            else if (this.__onboundedupdate)                    return unbindData.call(this, function(){ notifyOnunbind.call(this); });
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
    function getSelectListValue()
    {
        if (this.__element.options.length > 0) for(var counter=0;counter<this.__element.options.length;counter++) if (this.__element.options[counter].selected)   return this.__rawValue = this.__element.options[counter].rawValue;
        return this.__rawValue;
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
            viewAdapter.refresh = function(){ bindRepeatedList.call(this, this.boundItem(this.__bindTo||"")); notifyOnboundedUpdate.call(this, this.boundItem(this.__bindTo||"")); };
        }
        viewAdapter.bindingRoot             = function(){return this.__bindingRoot;};
        viewAdapter.bindTo                  =
        function(value)
        {
            if(value === undefined)         return this.__bindTo;
            var boundItem   = this.boundItem;
            if (boundItem !== undefined)    this.unbindData();
            this.__bindTo = value;
            if (boundItem !== undefined)    this.bindData(boundItem);
            this.triggerEvent("bindToUpdated");
        };
        each(["bindSource", "bindSourceValue", "bindSourceText"],
        function(name)
        {
            viewAdapter[name]               =
            function(value)
            {
                if(value === undefined)         return this["__"+name];
                var boundSource = this.boundSource;
                if (boundSource !== undefined)  this.unbindSourceData();
                this["__"+name] = value;
                if (boundSource !== undefined)  this.bindSourceData(boundSource);
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