!function()
{"use strict";
root.define("atomic.htmlAttachViewMemberAdapters",
function htmlAttachViewMemberAdapters(document, removeItemFromArray, setTimeout, clearTimeout)
{
    function bindRepeatedList(observer, bindTo)
    {
        var documentFragment    = document.createDocumentFragment();
        this.__detach(documentFragment);
        unbindRepeatedList.call(this);
        for(var dataItemCounter=0;dataItemCounter<observer().length;dataItemCounter++)
        {
            var subDataItem = observer(dataItemCounter);
            for(var templateKeyCounter=0;templateKeyCounter<this.__templateKeys.length;templateKeyCounter++)
            {
                var clone                       = this.__createTemplateCopy(this.__templateKeys[templateKeyCounter]);
                var key                         = clone.getKey(subDataItem);
                this.__repeatedControls[key]    = clone.control;
                clone.control.bindData(subDataItem);
                clone.parent.appendChild(clone.control.__element);
            }
        }
        this.__reattach();
    }
    function unbindRepeatedList()
    {
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
    function notifyOnunbind(data) { if (this.__onunbind) this.__onunbind(data); }
    var bindSourceFunctions  =
    {
        "default":
        function(sources)
        {
            for(var controlKey in this.controls)    this.controls[controlKey].bindSource(sources);
            return this;
        }
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
    var bindDataFunctions  =
    {
        "default":
        function(observer)
        {
            this.boundItem          = observer;
            if (this.__bindTo !== undefined || this.__bindAs)
            {
                if(this.__bindAs)   this.__bindListener     = (function(item){this.value(this.__bindAs(this.__bindTo !== undefined ? item(this.__bindTo) : item), true);}).bind(this);
                else
                {
                    this.__bindListener     = (function(item){this.value(item(this.__bindTo), true);}).bind(this);
                    this.__inputListener    = (function() {observer(this.__bindTo, this.value());}).bind(this);
                    bindUpdateEvents.call(this);
                }
                observer.listen(this.__bindListener);
            }
            notifyOnbind.call(this, observer);
            return this;
        },
        container:
        function(observer)
        {
            this.boundItem  = observer;
            for(var controlKey in this.controls)    this.controls[controlKey].bindData(this.boundItem(this.__bindTo||""));
            notifyOnbind.call(this, observer);
            return this;
        },
        repeater:
        function(observer)
        {
            this.boundItem          = observer;
            this.__bindListener = (function(item){bindRepeatedList.call(this, this.boundItem(this.__bindTo||""));}).bind(this);
            observer.listen(this.__bindListener);
            notifyOnbind.call(this, observer);
            return this;
        }
    };
    var unbindDataFunctions  =
    {
        "default":
        function()
        {
            if (this.boundItem !== undefined && this.__bindTo !== undefined)
            {
                this.boundItem.ignore(this.__bindListener);
                delete this.__bindListener;
                unbindUpdateEvents.call(this);
                delete this.__inputListener;
                delete this.boundItem;
            }
            notifyOnunbind.call(this);
            return this;
        },
        container:
        function()
        {
            delete this.boundItem;
            for(var controlKey in this.controls)    this.controls[controlKey].unbindData();
            notifyOnunbind.call(this);
            return this;
        },
        repeater:
        function()
        {
            if (this.boundItem === undefined)   return;
            this.boundItem.ignore(this.__bindListener);
            delete this.boundItem;
            var documentFragment    = document.createDocumentFragment();
            this.__detach(documentFragment);
            unbindRepeatedList.call(this);
            this.__reattach();
            notifyOnunbind.call(this);
            return this;
        }
    };
    function htmlBasedValueFunc(value, forceSet)
    {
        if (value !== undefined || forceSet)    this.__element.innerHTML=value;
        else                                    return this.__element.innerHTML;
    }
    var valueFunctions  =
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
        "span":     htmlBasedValueFunc,
        "label":    htmlBasedValueFunc
    };
    function addClass(element, className)
    {
        var classNames  = element.className.split(" ");
        if (classNames.indexOf(className) === -1) classNames.push(className);
        element.className = classNames.join(" ");
    }
    function removeClass(element, className)
    {
        var classNames  = element.className.split(" ");
        if (classNames.indexOf(className) > -1) removeItemFromArray(classNames, className);
        element.className = classNames.join(" ");
    }
    function createElementListener(listeners)
    {
        return function() { for(var listenerCounter=0;listenerCounter<listeners.listeners.length;listenerCounter++)   listeners.listeners[listenerCounter].apply(null, arguments); };
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
            listeners.elementListener   = createElementListener(listeners);
            viewAdapter.__element.addEventListener(eventName, listeners.elementListener, withCapture);
        }
    }

    return function(viewAdapter)
    {
        var listenersUsingCapture       = {};
        var listenersNotUsingCapture    = {};
        function getListeners(eventName, withCapture)
        {
            var listeners       = withCapture ? listenersUsingCapture : listenersNotUsingCapture;
            var eventListeners  = listeners[eventName];
            if (eventListeners === undefined)   eventListeners  = listeners[eventName]  = {listeners: []};
            return eventListeners;
        }

        viewAdapter.addClass            = function(className){ addClass(this.__element, className); }
        viewAdapter.addEventListener    = function(eventName, listener, withCapture, notifyEarly){ addListener(this, eventName, getListeners(eventName, withCapture), listener, withCapture, notifyEarly); };
        viewAdapter.appendControl       = function(childControl){ this.__element.appendChild(childControl.__element); };
        viewAdapter.attribute           =
        function(attributeName, value)
        {
            if (value === undefined)    return this.__element.getAttribute("data-" + attributeName);
            else                        this.__element.setAttribute("data-" + attributeName, value);
        };
        viewAdapter.bindSource          = bindSourceFunctions[viewAdapter.__element.nodeName.toLowerCase() + (viewAdapter.__element.type ? ":" + viewAdapter.__element.type.toLowerCase() : "")]||bindSourceFunctions.default;
        viewAdapter.bindData            = viewAdapter.__templateKeys ? bindDataFunctions.repeater : viewAdapter.controls ? bindDataFunctions.container : bindDataFunctions.default;
        viewAdapter.blur                = function(){this.__element.blur(); return this;}
        viewAdapter.__detach            = function(documentFragment){this.__elementParent = this.__element.parentNode; documentFragment.appendChild(this.__element); return this;};
        viewAdapter.focus               = function(){this.__element.focus(); return this;}
        viewAdapter.hide                = function(){ this.__element.style.display="none"; return this;};
        viewAdapter.hideFor             = function(milliseconds){ this.hide(); setTimeout((function(){this.show();}).bind(this), milliseconds); return this;};
        viewAdapter.removeClass         = function(className){ removeClass(this.__element, className); return this;}
        viewAdapter.removeControl       = function(childControl){ this.__element.removeChild(childControl.__element); return this;};
        viewAdapter.removeEventListener = function(eventName, listener, withCapture){ removeListener(this, eventName, getListeners(eventName, withCapture), listener, withCapture); return this;};
        viewAdapter.__reattach          = function(){this.__elementParent.appendChild(this.__element); return this;};
        viewAdapter.show                = function(){ this.__element.style.display=""; return this;};
        viewAdapter.showFor             = function(milliseconds){ this.show(); setTimeout((function(){this.hide();}).bind(this), milliseconds); return this;};
        viewAdapter.toggleClass         = function(className, condition){ this[condition?"addClass":"removeClass"](className); return this;};
        viewAdapter.toggleDisplay       = function(condition){ this[condition?"show":"hide"](); return this;};
        viewAdapter.unbindData          = viewAdapter.__templateKeys ? unbindDataFunctions.repeater : viewAdapter.controls ? unbindDataFunctions.container : unbindDataFunctions.default;
        viewAdapter.value               = valueFunctions[viewAdapter.__element.nodeName.toLowerCase() + (viewAdapter.__element.type ? ":" + viewAdapter.__element.type.toLowerCase() : "")]||valueFunctions.default;
        if (viewAdapter.__element.nodeName.toLowerCase()=="input" && viewAdapter.__element.type.toLowerCase()=="text")
        {
            viewAdapter.select          = function(){this.__element.select(); return this;};
        }
    };
});}();