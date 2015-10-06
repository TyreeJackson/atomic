﻿!function()
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
    function each(array, callback) { for(var arrayCounter=0;arrayCounter<array.length;arrayCounter++) callback(array[arrayCounter]); }
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
                if(this.__bindAs)   this.__bindListener     = (function(){this.value(this.__bindAs(this.__bindTo !== undefined ? observer(this.__bindTo) : observer), true);}).bind(this);
                else
                {
                    this.__bindListener     = (function(){this.value(observer(this.__bindTo), true);}).bind(this);
                    this.__inputListener    = (function(){observer(this.__bindTo, this.value());}).bind(this);
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
!function()
{"use strict";root.define("atomic.initializeViewAdapter",
function(each)
{
    var initializers    =
    {
        onenter:    function(viewAdapter, callback) { viewAdapter.addEventListener("keypress", function(event){ if (event.keyCode==13) callback.call(viewAdapter); }, false); },
        onescape:   function(viewAdapter, callback) { viewAdapter.addEventListener("keydown", function(event){ if (event.keyCode==27) callback.call(viewAdapter); }, false); },
        hidden:     function(viewAdapter, value)    { if (value) viewAdapter.hide(); }
    };
    each(["bindAs", "bindSource", "bindTo", "onbind", "onunbind", "updateon"], function(val){ initializers[val] = function(viewAdapter, value) { viewAdapter["__" + val] = value; }; });
    each(["blur", "change", "click", "contextmenu", "copy", "cut", "dblclick", "drag", "drageend", "dragenter", "dragleave", "dragover", "dragstart", "drop", "focus", "focusin", "focusout", "input", "keydown", "keypress", "keyup", "mousedown", "mouseenter", "mouseleave", "mousemove", "mouseover", "mouseout", "mouseup", "paste", "search", "select", "touchcancel", "touchend", "touchmove", "touchstart", "wheel"], function(val){ initializers["on" + val] = function(viewAdapter, callback) { viewAdapter.addEventListener(val, callback.bind(viewAdapter), false); }; });

    return function initializeViewAdapter(viewAdapter, viewAdapterDefinition)
    {
        for(var initializerKey in initializers)    if (viewAdapterDefinition.hasOwnProperty(initializerKey))    initializers[initializerKey](viewAdapter, viewAdapterDefinition[initializerKey]);
    };
});}();
!function()
{"use strict";root.define("atomic.isolatedFunctionFactory",
function isolatedFunctionFactory(document)
{
    return function(functionToIsolate)
    {
        var iframe              = document.createElement("iframe");
        iframe.style.display    = "none";
        document.body.appendChild(iframe);
        frames[frames.length - 1].document.write("<script>parent.__isolatedFunction = " + functionToIsolate.toString() + "; parent.__isolatedFunction.__prototype=Function.prototype;<\/script>");
        var __isolatedFunction  = window.__isolatedFunction;
        delete window.__isolatedFunction;
        document.body.removeChild(iframe);
        return __isolatedFunction;
    };
});}();
!function()
{"use strict";root.define("atomic.htmlViewAdapterFactorySupport",
function htmlViewAdapterFactorySupport(document, attachViewMemberAdapters, initializeViewAdapter, pubSub)
{
    var querySelector       =
    function(uiElement, selector)
    {
        var element = uiElement.querySelector(selector);
        if (element === null)   throw new Error("Element for selector " + selector + " was not found in " + (uiElement.id?("#"+uiElement.id):("."+uiElement.className)));
        element.removeAttribute("id");
        return element;
    };
    function removeAllElementChildren(element)
    {
        while(element.lastChild)    element.removeChild(element.lastChild);
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
            viewAdapter.__controlKeys   = [];
            viewAdapter.controls        = {};
            for(var controlKey in controlDeclarations)
            {
                viewAdapter.__controlKeys.push(controlKey);
                viewAdapter.controls[controlKey] = this.createControl(controlDeclarations[controlKey], querySelector(viewElement, (controlDeclarations[controlKey].selector||("#"+controlKey))), viewAdapter);
            }
        },
        createControl:
        function(controlDeclaration, controlElement, parent)
        {
            var control = this.create(controlDeclaration.viewAdapter||function(){ return controlDeclaration; }, controlElement, parent);
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
            function(templateKey)
            {
                var templateElement = this.__templateElements[templateKey];
                return { getKey: templateElement.declaration.getKey, parent: templateElement.parent, control: internalFunctions.createControl(templateElement.declaration, templateElement.element.cloneNode(true), viewAdapter) };
            };
            for(var templateKey in templateDeclarations)
            {
                viewAdapter.__templateKeys.push(templateKey);
                var templateDeclaration                         = templateDeclarations[templateKey];
                var templateElement                             = querySelector(viewElement, (templateDeclaration.selector||("#"+templateKey)));
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
        function createViewAdapter(viewAdapterDefinitionConstructor, viewElement, parent)
        {
            var viewAdapter             = {__element: viewElement, parent: parent};
            var viewAdapterDefinition   = new viewAdapterDefinitionConstructor(viewAdapter);
            this.attachControls(viewAdapter, viewAdapterDefinition.controls, viewElement);
            this.extractDeferredControls(viewAdapter, viewAdapterDefinition.repeat, viewElement);
            attachViewMemberAdapters(viewAdapter);
            this.addEvents(viewAdapter, viewAdapterDefinition.events);
            this.addCustomMembers(viewAdapter, viewAdapterDefinition.members);
            if(viewAdapter.construct)   viewAdapter.construct(viewAdapter);
            return viewAdapter;
        }
    };
    return internalFunctions;
}
);
root.define("atomic.viewAdapterFactory",
function(internalFunctions, observableFactory)
{
return { create: function createViewAdapter(viewAdapterDefinitionConstructor, viewElement, parent) { return internalFunctions.create(viewAdapterDefinitionConstructor, viewElement, parent); } };
}
);
root.define("atomic.observerFactory",
function(removeFromArray, isolatedFunctionFactory)
{
    function extractArrayPathSegmentsInto(subSegments, returnSegments, path)
    {
        for(var subSegmentCounter=0;subSegmentCounter<subSegments.length;subSegmentCounter++)
        {
            var subSegment  = subSegments[subSegmentCounter];
            // warning: string subsegments are not currently supported
            if (isNaN(subSegment))  throw new Error("An error occured while attempting to parse a array subSegment index in the path " + path);
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
    return function observer(_item)
    {
        var bag             = {item: _item};
        var itemListeners   = [];
        var propertyKeys    = [];
        var updating        = [];
        var rollingback     = false;

        function notifyPropertyListener(propertyKey, listener)
        {
            if (listener.callback !== undefined && (propertyKey == "" || (listener.properties !== undefined && listener.properties.hasOwnProperty(propertyKey))))
            {
                updating.push(listener);
                listener.properties = {};
                listener.callback();
                updating.pop();
            }
        }
        function notifyPropertyListeners(propertyKey, value)
        {
            for(var listenerCounter=0;listenerCounter<itemListeners.length;listenerCounter++)   notifyPropertyListener.call(this, propertyKey, itemListeners[listenerCounter]);
        }
        var arraySubObserver                        =
        new isolatedFunctionFactory
        (function arraySubObserverFactory(basePath)
        {
            function arraySubObserver(path, value)
            {
                if (path === undefined) return arraySubObserver.__item(basePath);
                if (path === null)      path    = "";
                return arraySubObserver.__invoke(path.toString(), value);
            }
            arraySubObserver.__getBasePath  = function(){return basePath;};
            return arraySubObserver;
        });
        var arraySubObserverPrototype               = arraySubObserver.__prototype;
        delete  arraySubObserver.__prototype;
        arraySubObserverPrototype.__invoke          =
        function(path, value)
        {
            if (path === undefined || path === null)    path    = "";
            var pathSegments    = extractPathSegments(this.__getBasePath()+"."+path);
            var revisedPath     = getFullPath(pathSegments);
            if (value === undefined)
            {
                if (updating.length > 0  && pathSegments.length > 0)   addProperties(updating[updating.length-1].properties, pathSegments);
                var returnValue = navDataPath(bag, pathSegments);
                if (typeof returnValue == "object")
                {
                    if (returnValue.constructor == Array)   return new arraySubObserver(revisedPath);
                    return new subObserver(revisedPath);
                }
                return returnValue;
            }
            if (rollingback)    return;
            navDataPath(bag, pathSegments, value);
            notifyPropertyListeners.call(this, revisedPath, value);
        }
        arraySubObserverPrototype.__item            = function(basePath) { return navDataPath(bag, extractPathSegments(basePath)); }
        arraySubObserverPrototype.listen            =
        function(callback)
        {
            var listener    = {callback: callback};
            itemListeners.push(listener);
            notifyPropertyListener.call(this, "", listener);
        }
        arraySubObserverPrototype.ignore            =
        function(callback)
        {
            for(var listenerCounter=0;listenerCounter<itemListeners.length;listenerCounter++)
            if (itemListeners[listenerCounter].callback === callback)
            removeFromArray(itemListeners, listenerCounter);
        }
        arraySubObserverPrototype.beginTransaction  =
        function()
        {
            bag.backup  = JSON.parse(JSON.stringify(bag.item));
        }
        arraySubObserverPrototype.commit            =
        function()
        {
            delete bag.backup;
        }
        arraySubObserverPrototype.rollback          =
        function()
        {
            rollingback = true;
            bag.item    = bag.backup;
            delete bag.backup;
            notifyPropertyListeners.call(this, this.__getBasePath(), bag.item);
            rollingback = false;
        }
        var subObserver                             =
        new isolatedFunctionFactory
        (function subObserverFactory(basePath)
        {
            function subObserver(path, value)
            {
                if (path === undefined) return subObserver.__item(basePath);
                if (path === null)      path    = "";
                return subObserver.__invoke(path, value);
            }
            subObserver.__getBasePath   = function(){return basePath;};
            return subObserver;
        });
        var subObserverPrototype                    = subObserver.__prototype;
        delete  subObserver.__prototype;
        subObserverPrototype.__invoke               =
        function(path, value)
        {
            if (path === undefined || path === null)    path    = "";
            var pathSegments    = extractPathSegments(this.__getBasePath()+"."+path);
            var revisedPath     = getFullPath(pathSegments);
            if (value === undefined)
            {
                if (updating.length > 0 && pathSegments.length > 0)   addProperties(updating[updating.length-1].properties, pathSegments);
                var returnValue = navDataPath(bag, pathSegments);
                if (typeof returnValue == "object")
                {
                    if (returnValue.constructor == Array)   return new arraySubObserver(revisedPath);
                    return new subObserver(revisedPath);
                }
                return returnValue;
            }
            if (rollingback)    return;
            navDataPath(bag, pathSegments, value);
            notifyPropertyListeners.call(this, revisedPath, value);
        }
        subObserverPrototype.__item                 = function(basePath) { return navDataPath(bag, extractPathSegments(basePath)); }
        subObserverPrototype.listen                 =
        function(callback)
        {
            var listener    = {callback: callback};
            itemListeners.push(listener);
            notifyPropertyListener.call(this, "", listener);
        }
        subObserverPrototype.ignore                 =
        function(callback)
        {
            for(var listenerCounter=0;listenerCounter<itemListeners.length;listenerCounter++)
            if (itemListeners[listenerCounter].callback === callback)
            removeFromArray(itemListeners, listenerCounter);
        }
        subObserverPrototype.beginTransaction       =
        function()
        {
            bag.backup  = JSON.parse(JSON.stringify(bag.item));
        }
        subObserverPrototype.commit                 =
        function()
        {
            delete bag.backup;
        }
        subObserverPrototype.rollback               =
        function()
        {
            rollingback = true;
            bag.item    = bag.backup;
            delete bag.backup;
            notifyPropertyListeners.call(this, this.__getBasePath(), bag.item);
            rollingback = false;
        }
        return new subObserver("");
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
                    document,
                    root.utilities.removeItemFromArray, 
                    window.setTimeout, 
                    window.clearTimeout
                ),
                new root.atomic.initializeViewAdapter(root.utilities.each),
                root.utilities.pubSub
            )
        ),
        observer:
        new root.atomic.observerFactory(root.utilities.removeFromArray, new root.atomic.isolatedFunctionFactory(document))
    }
});}();