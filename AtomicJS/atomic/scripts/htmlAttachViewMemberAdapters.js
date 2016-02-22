!function()
{"use strict";root.define("atomic.htmlAttachViewMemberAdapters", function htmlAttachViewMemberAdapters(window, document, removeItemFromArray, setTimeout, clearTimeout, each)
{
    function bindRepeatedList(observer)
    {
        var documentFragment    = document.createDocumentFragment();
        this.__detach(documentFragment);
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
                    clone.parent.appendChild(clone.control.__element);
                }
            }
        }
        this.bindSourceData(this.boundSource);
        this.__reattach();
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
    function notifyOnbind(data) { if (this.__onbind) this.__onbind(data); notifyOnboundedUpdate.call(this, data); }
    function notifyOnboundedUpdate(data) { if (this.__onboundedupdate) this.__onboundedupdate(data); }
    function notifyOnunbind(data) { if (this.__onunbind) this.__onunbind(data); }
    function clearSelectList(selectList)
    {
        for(var counter=selectList.options.length-1;counter>=0;counter--)
        {
            selectList.remove(counter);
        }
    }
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
            option.rawValue = sourceItem[this.__bindSourceValue];
            option.text     = sourceItem[this.__bindSourceText];
            option.selected = sourceItem[this.__bindSourceValue] == selectedValue;
            this.__element.appendChild(option);
        }
    }
    function clearRadioGroup(radioGroup)
    {
        for(var counter=radioGroup.childNodes.length-1;counter>=0;counter--)
        {
            radioGroup.removeChild(radioGroup.childNodes[counter]);
        }
    }
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
            radioGroupItem.__radioElement.rawValue  = sourceItem[this.__bindSourceValue];
            radioGroupItem.__radioLabel.innerHTML   = sourceItem[this.__bindSourceText];
            radioGroupItem.__radioElement.checked   = sourceItem[this.__bindSourceValue] == selectedValue;
            this.__element.appendChild(radioGroupItem);
        }
    }
    var bindSourceFunctions     =
    {
        "default":          function(sources){},
        "container":
        function(sources)
        {
            if (sources !== undefined)
            {
                this.boundSource            = sources;
                for(var controlKey in this.controls)    this.controls[controlKey].bindSourceData(this.boundSource(this.__bindSource||""));
            }
            return this;
        },
        "repeater":
        function(sources)
        {
            if (sources !== undefined)
            {
                this.boundSource            = sources;
                for(var controlKey in this.__repeatedControls)    this.__repeatedControls[controlKey].bindSourceData(this.boundSource(this.__bindSource||""));
            }
            return this;
        },
        "select:select-one":
        function(sources)
        {
            if (sources !== undefined)
            {
                this.boundSource            = sources;
                this.__bindSourceListener   = (function(){bindSelectListSource.call(this);}).bind(this);
                this.boundSource.listen(this.__bindSourceListener);
            }
            return this;
        },
        "radiogroup":
        function(sources)
        {
            if (sources !== undefined)
            {
                this.boundSource            = sources;
                if (this.__templateElement === undefined)
                {
					this.__radioButtonSelector	= this.__element.getAttribute("data-atomic-radiobutton")||"input[type='radio']";
                    this.__radioLabelSelector   = this.__element.getAttribute("data-atomic-radiolabel")||"label";
                    this.__templateElement      = this.__element.querySelector("radiogroupitem");
                    this.__templateElement.parentNode.removeChild(this.__templateElement);
                    clearRadioGroup(this.__element);
                }
                this.__bindSourceListener   = (function(){bindRadioGroupSource.call(this);}).bind(this);
                this.boundSource.listen(this.__bindSourceListener);
            }
            return this;
        }
    };
    var unbindSourceFunctions   =
    {
        "default":          function(sources){},
        "container":
        function()
        {
            if (this.boundSource !== undefined && this.__bindSource !== undefined)
            {
                this.boundSource.ignore(this.__bindSourceListener);
                delete this.__bindSourceListener;
                delete this.boundSource;
                for(var controlKey in this.controls)    this.controls[controlKey].unbindSourceData();
            }
            return this;
        },
        "repeater":
        function()
        {
            if (this.boundSource !== undefined && this.__bindSource !== undefined)
            {
                this.boundSource.ignore(this.__bindSourceListener);
                delete this.__bindSourceListener;
                delete this.boundSource;
                for(var controlKey in this.__repeatedControls)    this.__repeatedControls[controlKey].unbindSourceData();
            }
            return this;
        },
        "select:select-one":
        function()
        {
            if (this.boundSource !== undefined && this.__bindSource !== undefined)
            {
                this.boundSource.ignore(this.__bindSourceListener);
                delete this.__bindSourceListener;
                delete this.boundSource;
                clearSelectList(this.__element);
            }
            return this;
        },
        "radiogroup":
        function()
        {
            if (this.boundSource !== undefined && this.__bindSource !== undefined)
            {
                this.boundSource.ignore(this.__bindSourceListener);
                delete this.__bindSourceListener;
                delete this.boundSource;
                clearRadioGroup(this.__element);
            }
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
                if(this.__bindAs)   this.__bindListener     = (function(){this.value(this.__bindAs(this.__bindTo !== undefined ? observer(this.__bindTo) : observer), true);}).bind(this);
                else
                {
                    this.__bindListener     = (function(){if (!this.__notifyingObserver) this.value(observer(this.__bindTo), true); notifyOnboundedUpdate.call(this, observer);}).bind(this);
                    this.__inputListener    = (function(){this.__notifyingObserver=true; observer(this.__bindTo, this.value()); this.__notifyingObserver=false;}).bind(this);
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
            for(var controlKey in this.controls)    if (!this.controls[controlKey].__bindingRoot) this.controls[controlKey].bindData(this.boundItem(this.__bindTo||""));
            this.__bindListener = (function(item){if (this.boundItem === undefined) debugger; notifyOnboundedUpdate.call(this, this.boundItem(this.__bindTo||""));}).bind(this);
            if (this.boundItem === undefined) debugger;
            observer.listen(this.__bindListener);
            return this;
        },
        repeater:
        function(observer)
        {
            this.boundItem          = observer;
            this.__bindListener = (function(item){bindRepeatedList.call(this, this.boundItem(this.__bindTo||"")); notifyOnboundedUpdate.call(this, this.boundItem(this.__bindTo||""));}).bind(this);
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
            this.boundItem.ignore(this.__bindListener);
            delete this.__bindListener;
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
            delete this.__bindListener;
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
        var listenersUsingCapture       = {};
        var listenersNotUsingCapture    = {};
        function getListeners(eventName, withCapture)
        {
            var listeners       = withCapture ? listenersUsingCapture : listenersNotUsingCapture;
            var eventListeners  = listeners[eventName];
            if (eventListeners === undefined)   eventListeners  = listeners[eventName]  = {listeners: []};
            return eventListeners;
        }

        viewAdapter.addClass            = function(className){ addClass(this.__element, className); return this;}
        viewAdapter.addClassFor         = function(className, milliseconds){ this.addClass(className); setTimeout((function(){this.removeClass(className);}).bind(this), milliseconds); return this;};
        viewAdapter.addEventListener    = function(eventName, listener, withCapture, notifyEarly){ addListener(this, eventName, getListeners(eventName, withCapture), listener, withCapture, notifyEarly); };
        viewAdapter.appendControl       = function(childControl){ this.__element.appendChild(childControl.__element); };
        viewAdapter.attribute           =
        function(attributeName, value)
        {
            if (value === undefined)    return this.__element.getAttribute("data-" + attributeName);
            this.__element.setAttribute("data-" + attributeName, value);
        };
        viewAdapter.bindSourceData      = viewAdapter.__templateKeys ? bindSourceFunctions.repeater : viewAdapter.controls ? bindSourceFunctions.container : bindSourceFunctions[viewAdapter.__element.nodeName.toLowerCase() + (viewAdapter.__element.type ? ":" + viewAdapter.__element.type.toLowerCase() : "")]||bindSourceFunctions.default;
        viewAdapter.bindData            = viewAdapter.__templateKeys ? bindDataFunctions.repeater : viewAdapter.controls ? bindDataFunctions.container : bindDataFunctions.default;
        if (viewAdapter.__templateKeys)
        {
            viewAdapter.refresh = function(){ bindRepeatedList.call(this, this.boundItem(this.__bindTo||"")); notifyOnboundedUpdate.call(this, this.boundItem(this.__bindTo||"")); };
        }
        viewAdapter.bindTo              =
        function(value)
        {
            if(value === undefined) return this.__bindTo;
            if (this.boundItem !== undefined)   this.unbindData();
            this.__bindTo = value;
            if (this.boundItem !== undefined)   this.bindData(this.boundItem);
        };
        each(["bindSource", "bindSourceValue", "bindSourceText"],
        function(name)
        {
            viewAdapter[name]           =
            function(value)
            {
                if(value === undefined) return this["__"+name];
                if (this.boundItem !== undefined)   this.unbindSourceData();
                this["__"+name] = value;
                if (this.boundItem !== undefined)   this.bindSourceData(this.boundSource);
            };
        });
        viewAdapter.blur                = function(){this.__element.blur(); return this;};
        viewAdapter.click               = function(){this.__element.click(); return this;};
        viewAdapter.__detach            = function(documentFragment){this.__elementParent = this.__element.parentNode; documentFragment.appendChild(this.__element); return this;};
        viewAdapter.focus               = function(){this.__element.focus(); return this;};
        viewAdapter.hasClass            = function(className){ return hasClass(this.__element, className); }
        viewAdapter.height              = function(){return this.__element.offsetHeight;}
        viewAdapter.hide                = function(){ this.__element.style.display="none"; return this;};
        viewAdapter.hideFor             = function(milliseconds){ this.hide(); setTimeout((function(){this.show();}).bind(this), milliseconds); return this;};
        viewAdapter.href                = function(value)
        {
            if (value === undefined)    return this.__element.href;
            this.__element.href=value;
            return this;
        };
        viewAdapter.removeClass         = function(className){ removeClass(this.__element, className); return this;}
        viewAdapter.removeClassFor      = function(className, milliseconds){ this.removeClass(className); setTimeout((function(){this.addClass(className);}).bind(this), milliseconds); return this;};
        viewAdapter.removeControl       = function(childControl){ this.__element.removeChild(childControl.__element); return this;};
        viewAdapter.removeEventListener = function(eventName, listener, withCapture){ removeListener(this, eventName, getListeners(eventName, withCapture), listener, withCapture); return this;};
        viewAdapter.__reattach          = function(){this.__elementParent.appendChild(this.__element); return this;};
        viewAdapter.show                = function(){ this.__element.style.display=""; if(this.__onshow !== undefined) this.__onshow.call(this); return this;};
        viewAdapter.showFor             = function(milliseconds){ this.show(); setTimeout((function(){this.hide();}).bind(this), milliseconds); return this;};
        viewAdapter.scrollIntoView      = function(){this.__element.scrollIntoView(); return this;};
        viewAdapter.toggleClass         = function(className, condition){ if (condition === undefined) condition = !this.hasClass(className); return this[condition?"addClass":"removeClass"](className); };
        viewAdapter.toggleEdit          = function(condition){ if (condition === undefined) condition = this.__element.getAttribute("contentEditable")!=="true"; this.__element.setAttribute("contentEditable", condition); return this;};
        viewAdapter.toggleDisplay       = function(condition){ if (condition === undefined) condition = this.__element.style.display=="none"; this[condition?"show":"hide"](); return this;};
        viewAdapter.triggerEvent        = function(eventName){ triggerEvent.call(getListeners(eventName, true)); triggerEvent.call(getListeners(eventName, false)); };
        viewAdapter.unbindData          = viewAdapter.__templateKeys ? unbindDataFunctions.repeater : viewAdapter.controls ? unbindDataFunctions.container : unbindDataFunctions.default;
        viewAdapter.unbindSourceData    = viewAdapter.__templateKeys ? unbindSourceFunctions.repeater : viewAdapter.controls ? unbindSourceFunctions.container : unbindSourceFunctions[viewAdapter.__element.nodeName.toLowerCase() + (viewAdapter.__element.type ? ":" + viewAdapter.__element.type.toLowerCase() : "")]||unbindSourceFunctions.default;
        viewAdapter.value               = valueFunctions[viewAdapter.__element.nodeName.toLowerCase() + (viewAdapter.__element.type ? ":" + viewAdapter.__element.type.toLowerCase() : "")]||valueFunctions.default;
        if (viewAdapter.__element.nodeName.toLowerCase()=="input" && viewAdapter.__element.type.toLowerCase()=="text")
        {
            viewAdapter.select          = function(){this.__element.select(); return this;};
        }
        else
        {
            viewAdapter.select          = function(){selectContents(this.__element); return this; };
        }
        viewAdapter.width               = function(){return this.__element.offsetWidth;}
        if (viewAdapterDefinition.extensions !== undefined && viewAdapterDefinition.extensions.length !== undefined)
        for(var counter=0;counter<viewAdapterDefinition.extensions.length;counter++)    viewAdapterDefinition.extensions[counter].extend(viewAdapter);
    };
});}();