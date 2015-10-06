/*
outstanding issues:
support string key paths in observable
add routing
*/
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