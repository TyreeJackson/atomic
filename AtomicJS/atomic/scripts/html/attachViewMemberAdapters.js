!function()
{"use strict";root.define("atomic.html.attachViewMemberAdapters", function htmlAttachViewMemberAdapters(window, document, removeItemFromArray, setTimeout, clearTimeout, each, defineDataProperties, pubSub)
{


/*    defineDataProperties
    (input,
    {
        value:
        {
            get:        valueFunctions[viewAdapter.__element.nodeName.toLowerCase() + (viewAdapter.__element.type ? ":" + viewAdapter.__element.type.toLowerCase() : "")]||valueFunctions.default,
            set:        valueFunctions[viewAdapter.__element.nodeName.toLowerCase() + (viewAdapter.__element.type ? ":" + viewAdapter.__element.type.toLowerCase() : "")]||valueFunctions.default,
            onchange:   valueFunctions[viewAdapter.__element.nodeName.toLowerCase() + (viewAdapter.__element.type ? ":" + viewAdapter.__element.type.toLowerCase() : "")]||valueFunctions.default
        }
    });*/


/*    if (viewAdapterDefinition.extensions !== undefined && viewAdapterDefinition.extensions.length !== undefined)
    for(var counter=0;counter<viewAdapterDefinition.extensions.length;counter++)
    {
        if (viewAdapterDefinition.extensions[counter] === undefined) throw new Error("Extension was undefined in view adapter with element " + viewAdapter.__element.__selectorPath+"-"+viewAdapter.__selector);
        if (viewAdapterDefinition.extensions[counter].extend !== undefined) viewAdapterDefinition.extensions[counter].extend(viewAdapter);
    }*/

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
        this.__bindListener = (function(){ var item = this.data; if ( item(this.__bindTobindTo||"") === undefined) return; this.data.ignore(this.__bindListener); this.__bindListener.ignore=true; delete this.__bindListener; this.bindData(item); }).bind(this);
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
    return function(viewAdapter, viewAdapterDefinition)
    {
        var listenersUsingCapture           = {};
        var listenersNotUsingCapture        = {};

    };
});}();