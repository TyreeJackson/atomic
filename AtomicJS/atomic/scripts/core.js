!function()
{
    root.define
    (
        "atomic.htmlViewAdapterFactorySupport",
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
    root.define
    (
        "atomic.viewAdapterFactory",
        function(internalFunctions)
        {
     return {
                create: function createViewAdapter(viewAdapterDefinitionConstructor, viewElement, parent) { return internalFunctions.create(viewAdapterDefinitionConstructor, viewElement, parent); }
            };
        }
    );
    root.define
    (
        "atomic.observer",
        function(removeFromArray)
        {
            function extractArrayPathSegmentsInto(subSegments, returnSegments, path)
            {
                for(var subSegmentCounter=0;subSegmentCounter<subSegments.length;subSegmentCounter++)
                {
                    var subSegment  = subSegments[subSegmentCounter];
                    // warning: string subsegmenys are not currently supported
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
                if (paths.length == 0) return root;
                var path    = paths[0].value;
                for(var pathCounter=1;pathCounter<paths.length;pathCounter++)   path    += "." + paths[pathCounter].value;
                return path;
            }
            function navDataPath(root, paths, value)
            {
                if (paths.length == 0) return root;
                var current     = root;
                for(var pathCounter=0;pathCounter<paths.length-1;pathCounter++)
                {
                    var path    = paths[pathCounter];
                    if (current[path.value] === undefined)    current[path.value]   = path.type===0?{}:[];
                    current     = current[path.value];
                }
                if (value !== undefined)    current[paths[paths.length-1].value]    = value;
                else                        return current[paths[paths.length-1].value];
            }
            function addPropertyPath(properties, path)
            {
                if (properties.indexOf(path) == -1) properties.push(path);
            }
            function addProperties(properties, pathSegments)
            {
                var path    = pathSegments[0].value;
                addPropertyPath(properties, path);
                for(var segmentCounter=1;segmentCounter<pathSegments.length;segmentCounter++)
                {
                    path    += "." + pathSegments[segmentCounter].value;
                    addPropertyPath(properties, path);
                }
            }
            return function(item)
            {
                var itemListeners   = [];
                var propertyKeys    = [];
                var updating        = null;
                var backup;
                var rollingback     = false;

                function notifyPropertyListener(propertyKey, listener)
                {
                    if (listener.callback !== undefined && (propertyKey == "" || listener.properties.indexOf(propertyKey) > -1))
                    {
                        updating = listener;
                        listener.properties = [];
                        listener.callback(this);
                        updating = null;
                    }
                }
                function notifyPropertyListeners(propertyKey, value)
                {
                    for(var listenerCounter=0;listenerCounter<itemListeners.length;listenerCounter++)   notifyPropertyListener.call(this, propertyKey, itemListeners[listenerCounter]);
                }
                function observable(path, value)
                {
                    var pathSegments    = extractPathSegments(path||"");
                    if (value === undefined)
                    {
                        if (updating !== null && pathSegments.length > 0)   addProperties(updating.properties, pathSegments);
                        return navDataPath(item, pathSegments);
                    }
                    if (rollingback)    return;
                    navDataPath(item, pathSegments, value);
                    var revisedPath = getFullPath(pathSegments);
                    notifyPropertyListeners.call(observable, revisedPath, value);
                }
                observable.listen           = function(callback)
                {
                    var listener    = {callback: callback};
                    itemListeners.push(listener);
                    notifyPropertyListener.call(this, "", listener);
                }
                observable.ignore           =
                function(callback)
                {
                    for(var listenerCounter=0;listenerCounter<itemListeners.length;listenerCounter++)
                    if (itemListeners[listenerCounter].callback === callback)
                    removeFromArray(itemListeners, listenerCounter);
                }
                observable.beginTransaction =
                function()
                {
                    backup  = JSON.parse(JSON.stringify(item));
                }
                observable.commit           =
                function()
                {
                    delete backup;
                }
                observable.rollback         =
                function()
                {
                    rollingback = true;
                    item        = backup;
                    delete backup;
                    notifyPropertyListeners.call(observable, "", item);
                    rollingback = false;
                }
                return observable;
            };
        }
    );
}();