!function()
{"use strict";
    var __root  = new __namespace();
    function __namespace()
    {
        return { define: function(fullName, item) { namespace(this, fullName, item); } };
    }
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
    window.root = __root;
}();
!function()
{"use strict";
    function each(array, callback) { for(var arrayCounter=0;arrayCounter<array.length;arrayCounter++) callback(array[arrayCounter], arrayCounter); }
    root.define("utilities.each", each);
    function pubSub()
    {
        var listeners   = [];
        function _pubSub() { for(var listenerCounter=0;listenerCounter<listeners.length;listenerCounter++) listeners[listenerCounter].apply(null, arguments); }
        _pubSub.listen  = function(listener) { listeners.push(listener); }
        _pubSub.ignore  = function(listener) { removeFromArray.call(listeners, listener); }
        return _pubSub;
    }
    root.define("utilities.pubSub", pubSub);
    function removeFromArray(array, from, to)
    {
        var rest        = array.slice((to || from) + 1 || array.length);
        array.length    = from < 0 ? array.length + from : from;
        return array.push.apply(array, rest);
    }
    root.define("utilities.removeFromArray", removeFromArray);
    function removeItemFromArray(array, item)
    {
        removeFromArray(array, array.indexOf(item));
    }
    root.define("utilities.removeItemFromArray", removeItemFromArray);
}();
!function()
{"use strict";root.define("atomic.htmlAttachViewMemberAdapters",
function htmlAttachViewMemberAdapters(window, document, removeItemFromArray, setTimeout, clearTimeout)
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
                this.__repeatedControls[clone.key]  = clone.control;
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
    function notifyOnbind(data) { if (this.__onbind) this.__onbind(data); notifyOnboundedUpdate.call(this, data); }
    function notifyOnboundedUpdate(data) { if (this.__onboundedupdate) this.__onboundedupdate(data); }
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
                if(this.__bindAs)   this.__bindListener     = (function(){this.value(this.__bindAs(this.__bindTo !== undefined ? observer(this.__bindTo) : observer), true);}).bind(this);
                else
                {
                    this.__bindListener     = (function(){if (!this.__notifyingObserver) this.value(observer(this.__bindTo), true);  notifyOnboundedUpdate.call(this, observer); }).bind(this);
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
            this.__bindListener = (function(item){ notifyOnboundedUpdate.call(this, this.boundItem(this.__bindTo||""));}).bind(this);
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
        "a":        htmlBasedValueFunc,
        "img":
        function(value, forceSet)
        {
            if (value !== undefined || forceSet)    this.__element.src  = value;
            else                                    return this.__element.src;
        },
        "dd":      htmlBasedValueFunc,
        "div":      htmlBasedValueFunc,
        "span":     htmlBasedValueFunc,
        "td":       htmlBasedValueFunc,
        "label":    htmlBasedValueFunc
    };
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
    function selectContents(element)
    {
        var range = document.createRange();
        range.selectNodeContents(element);
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }
    return function(viewAdapter, customAttachments, viewAdapterDefinition)
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
        viewAdapter.addEventListener    = function(eventName, listener, withCapture, notifyEarly){ addListener(this, eventName, getListeners(eventName, withCapture), listener, withCapture, notifyEarly); };
        viewAdapter.appendControl       = function(childControl){ this.__element.appendChild(childControl.__element); };
        viewAdapter.attribute           =
        function(attributeName, value)
        {
            if (value === undefined)    return this.__element.getAttribute("data-" + attributeName);
            this.__element.setAttribute("data-" + attributeName, value);
        };
        viewAdapter.bindSource          = bindSourceFunctions[viewAdapter.__element.nodeName.toLowerCase() + (viewAdapter.__element.type ? ":" + viewAdapter.__element.type.toLowerCase() : "")]||bindSourceFunctions.default;
        viewAdapter.bindData            = viewAdapter.__templateKeys ? bindDataFunctions.repeater : viewAdapter.controls ? bindDataFunctions.container : bindDataFunctions.default;
        viewAdapter.blur                = function(){this.__element.blur(); return this;};
        viewAdapter.click               = function(){this.__element.click(); return this;};
        viewAdapter.__detach            = function(documentFragment){this.__elementParent = this.__element.parentNode; documentFragment.appendChild(this.__element); return this;};
        viewAdapter.focus               = function(){this.__element.focus(); return this;};
        viewAdapter.hasClass            = function(className){ return hasClass(this.__element, className); }
        viewAdapter.href                = function(value)
        {
            if (value === undefined)    return this.__element.href;
            this.__element.href=value;
            return this;
        };
        viewAdapter.hide                = function(){ this.__element.style.display="none"; return this;};
        viewAdapter.hideFor             = function(milliseconds){ this.hide(); setTimeout((function(){this.show();}).bind(this), milliseconds); return this;};
        viewAdapter.removeClass         = function(className){ removeClass(this.__element, className); return this;}
        viewAdapter.removeControl       = function(childControl){ this.__element.removeChild(childControl.__element); return this;};
        viewAdapter.removeEventListener = function(eventName, listener, withCapture){ removeListener(this, eventName, getListeners(eventName, withCapture), listener, withCapture); return this;};
        viewAdapter.__reattach          = function(){this.__elementParent.appendChild(this.__element); return this;};
        viewAdapter.show                = function(){ this.__element.style.display=""; if(this.__onshow !== undefined) this.__onshow.call(this); return this;};
        viewAdapter.showFor             = function(milliseconds){ this.show(); setTimeout((function(){this.hide();}).bind(this), milliseconds); return this;};
        viewAdapter.scrollIntoView      = function(){this.__element.scrollIntoView(); return this;};
        viewAdapter.toggleClass         = function(className, condition){ if (condition === undefined) condition = !this.hasClass(className); return this[condition?"addClass":"removeClass"](className); };
        viewAdapter.toggleEdit          = function(condition){ if (condition === undefined) condition = this.__element.getAttribute("contentEditable")!=="true"; this.__element.setAttribute("contentEditable", condition); return this;};
        viewAdapter.toggleDisplay       = function(condition){ if (condition === undefined) condition = this.__element.style.display=="none"; this[condition?"show":"hide"](); return this;};
        viewAdapter.unbindData          = viewAdapter.__templateKeys ? unbindDataFunctions.repeater : viewAdapter.controls ? unbindDataFunctions.container : unbindDataFunctions.default;
        viewAdapter.value               = valueFunctions[viewAdapter.__element.nodeName.toLowerCase() + (viewAdapter.__element.type ? ":" + viewAdapter.__element.type.toLowerCase() : "")]||valueFunctions.default;
        if (viewAdapter.__element.nodeName.toLowerCase()=="input" && viewAdapter.__element.type.toLowerCase()=="text")
        {
            viewAdapter.select          = function(){this.__element.select(); return this;};
        }
        else
        {
            viewAdapter.select          = function(){selectContents(this.__element); return this; };
        }
        if (customAttachments !== undefined && customAttachments.length !== undefined)
        for(var counter=0;counter<customAttachments.length;counter++)   customAttachments[counter](viewAdapter, viewAdapterDefinition);
    };
});}();
!function()
{"use strict";root.define("atomic.initializeViewAdapter",
function(each)
{
    function cancelEvent(event)
    {
        event.preventDefault();
        event.stopPropagation();
        return false;
    }
    var initializers    =
    {
        onenter:    function(viewAdapter, callback) { viewAdapter.addEventListener("keypress", function(event){ if (event.keyCode==13) { callback.call(viewAdapter); return cancelEvent(event); } }, false); },
        onescape:   function(viewAdapter, callback) { viewAdapter.addEventListener("keydown", function(event){ if (event.keyCode==27) { callback.call(viewAdapter); return cancelEvent(event); } }, false); },
        hidden:     function(viewAdapter, value)    { if (value) viewAdapter.hide(); }
    };
    each(["bindAs", "bindingRoot", "bindSource", "bindTo", "onbind", "onboundedupdate", "onshow", "onunbind", "updateon"], function(val){ initializers[val] = function(viewAdapter, value) { viewAdapter["__" + val] = value; }; });
    each(["blur", "change", "click", "contextmenu", "copy", "cut", "dblclick", "drag", "drageend", "dragenter", "dragleave", "dragover", "dragstart", "drop", "focus", "focusin", "focusout", "input", "keydown", "keypress", "keyup", "mousedown", "mouseenter", "mouseleave", "mousemove", "mouseover", "mouseout", "mouseup", "paste", "search", "select", "touchcancel", "touchend", "touchmove", "touchstart", "wheel"], function(val){ initializers["on" + val] = function(viewAdapter, callback) { viewAdapter.addEventListener(val, callback.bind(viewAdapter), false); }; });

    return function initializeViewAdapter(viewAdapter, viewAdapterDefinition)
    {
        for(var initializerKey in initializers)
        if (viewAdapterDefinition.hasOwnProperty(initializerKey))    initializers[initializerKey](viewAdapter, viewAdapterDefinition[initializerKey]);

        if (viewAdapterDefinition.__customInitializers)
        for(var initializerSetKey in viewAdapterDefinition.__customInitializers)
        for(var initializerKey in viewAdapterDefinition.__customInitializers[initializerSetKey])
        if (viewAdapterDefinition.hasOwnProperty(initializerKey))   viewAdapterDefinition.__customInitializers[initializerSetKey][initializerKey](viewAdapter, viewAdapterDefinition[initializerKey]);
    };
});}();
!function()
{"use strict";root.define("atomic.isolatedFunctionFactory",
function isolatedFunctionFactory(document)
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
{"use strict";root.define("atomic.htmlViewAdapterFactorySupport",
function htmlViewAdapterFactorySupport(document, attachViewMemberAdapters, initializeViewAdapter, pubSub, logger)
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
            attachViewMemberAdapters(viewAdapter, viewAdapterDefinition.customAttachments, viewAdapterDefinition);
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
            }

            if(viewAdapter.construct)   viewAdapter.construct(viewAdapter);
            return viewAdapter;
        }
    };
    return internalFunctions;
});}();
!function()
{"use strict";root.define("atomic.viewAdapterFactory",
function(internalFunctions)
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
{"use strict";root.define("atomic.observerFactory",
function(removeFromArray, isolatedFunctionFactory)
{
    var functionFactory = new isolatedFunctionFactory();
    var subObserver                                 =
    functionFactory.create
    (function subObserverFactory(basePath, bag)
    {
        function subObserver(path, value)
        {
            return subObserver.__invoke(path, value);
        }
        Object.defineProperty(subObserver, "__basePath", {get:function(){return basePath;}});
        Object.defineProperty(subObserver, "__bag", {get:function(){return bag;}});
        return subObserver;
    });
    functionFactory.root.prototype.__invoke         =
    function(path, value)
    {
        if (path === undefined) return navDataPath(this.__bag, extractPathSegments(this.__basePath));
        if (path === null)      path    = "";
        var pathSegments    = extractPathSegments(this.__basePath+"."+path.toString());
        var revisedPath     = getFullPath(pathSegments);
        if (value === undefined)
        {
            if (this.__bag.updating.length > 0 && pathSegments.length > 0) addProperties(this.__bag.updating[this.__bag.updating.length-1].properties, pathSegments);
            var returnValue = navDataPath(this.__bag, pathSegments);
            if (typeof returnValue == "object")                 return new subObserver(revisedPath, this.__bag);
            return returnValue;
        }
        if (this.__bag.rollingback)    return;
        navDataPath(this.__bag, pathSegments, value);
        notifyPropertyListeners.call(this, revisedPath, value, this.__bag);
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
            if (current[path.value] === undefined)    current[path.value]   = path.type===0?{}:[];
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
        if (listener.callback !== undefined && (propertyKey == "" || (listener.properties !== undefined && listener.properties.hasOwnProperty(propertyKey))))
        {
            bag.updating.push(listener);
            listener.properties = {};
            listener.callback();
            bag.updating.pop();
        }
    }
    function notifyPropertyListeners(propertyKey, value, bag)
    {
        for(var listenerCounter=0;listenerCounter<bag.itemListeners.length;listenerCounter++)   notifyPropertyListener.call(this, propertyKey, bag.itemListeners[listenerCounter], bag);
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
        return new subObserver("", bag);
    };
});}();
!function()
{"use strict";root.define("atomic.htmlCompositionRoot",
function htmlCompositionRoot()
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
                    window.clearTimeout
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
