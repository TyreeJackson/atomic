!function()
{"use strict";
    var createObserver;
    function buildConstructor(removeFromArray, isolatedFunctionFactory, each, pathParser)
    {
        var getObserverEnum                             = {auto: 0, no: -1, yes: 1};
        var objectObserverFunctionFactory               = new isolatedFunctionFactory();
        var objectObserver                              =
        objectObserverFunctionFactory.create
        (function objectObserver(basePath, bag)
        {if (basePath==undefined) debugger;
            Object.defineProperties(this,
            {
                ___invoke:  {value: function(path, value){return this.__invoke(path, value, getObserverEnum.auto, false);}},
                __basePath: {get:   function(){return basePath;}},
                __bag:      {get:   function(){return bag;}},
                isDefined:  {value: function(propertyName){return this(propertyName)!==undefined;}},
                hasValue:   {value: function(propertyName){var value=this(propertyName); return value!==undefined && value!==null && value!=="";}}
            });
            return this;
        });
        var arrayObserverFunctionFactory                = new isolatedFunctionFactory();
        var arrayObserver                               =
        arrayObserverFunctionFactory.create
        (function arrayObserver(basePath, bag)
        {
            Object.defineProperties(this,
            {
                ___invoke:  {value: function(path, value){return this.__invoke(path, value, getObserverEnum.auto, false);}},
                __basePath: {get:   function(){return basePath;}},
                __bag:      {get:   function(){return bag;}}
            });
            return this;
        });
        function createObserver(revisedPath, bag, isArray)
        {
            return new (isArray?arrayObserver:objectObserver)(revisedPath, bag);
        }
        function getFullPath(paths)
        {
            if (paths.length == 0) return "";
            var path    = paths[0];
            for(var pathCounter=1;pathCounter<paths.length;pathCounter++)   path    += "." + paths[pathCounter];
            return path;
        }
        function addPropertyPath(bag, path, listener, direct)
        {
            if (bag.listenersByPath[path] === undefined)    bag.listenersByPath[path]   = {}
            bag.listenersByPath[path][listener.id]          = {listener: listener, direct: direct};
            listener.properties[path]                       = true;
        }
        function addProperties(bag, pathSegments)
        {
            var listener    = bag.updating[bag.updating.length-1];
            if (listener.ignore)    return;

            addPropertyPath(bag, "", listener, false);
            if (pathSegments.length === 0)  return;

            var path        = pathSegments[0];
            addPropertyPath(bag, path, listener, pathSegments.length == 1);
            for(var segmentCounter=1;segmentCounter<pathSegments.length;segmentCounter++)
            {
                path        += "." + pathSegments[segmentCounter];
                addPropertyPath(bag, path, listener, segmentCounter == pathSegments.length - 1);
            }
        }
        function unregisterListenerFromProperties(bag, listener)
        {
            var propertyPaths   = Object.keys(listener.properties);
            for(var propertyPathCounter=0,propertyPath;(propertyPath=propertyPaths[propertyPathCounter++]) !== undefined;)
            {
                delete bag.listenersByPath[propertyPath][listener.id];
                delete listener.properties[propertyPath];
            }
            if (Object.keys(listener.properties).length > 0) {debugger; throw new Error("Invalid operation: the properties bag should be empty.");}
        }
        function notifyPropertyListener(listener, bag, value)
        {
            bag.updating.push(listener);
            // useful for debugging.  I should consider a hook that allows debuggers to report on why re-evaluation of bound properties occur: var oldProperties   = listener.properties;

            unregisterListenerFromProperties(bag, listener);
            var postCallback    = listener.callback.call
            (
                listener.observer,
                value, 
                function(callback)
                {
                    listener.ignore =true;
                    try     {callback();}
                    catch(e){}
                    listener.ignore = false;
                }
            );
            bag.updating.pop();
            if (postCallback !== undefined) postCallback();
        }
        function notifyPropertyListeners(propertyKey, value, bag, directOnly)
        {
            if (bag.__updatingLinkedObservers)  {return;}
            var listenersToNotify   = {};

            var listeners       = bag.listenersByPath[propertyKey];
            if (listeners !== undefined)
            {
                var listenerIds     = Object.keys(listeners);
                for(var listenerIdCounter=0,listener;(listener=listeners[listenerIds[listenerIdCounter++]]) !== undefined;)
                    if (listener.listener.callback !== undefined && !listener.listener.callback.ignore && (!directOnly||listener.direct)) listenersToNotify[listener.listener.id]  = listener.listener;
            }

            for(var rootPath in bag.listenersByRootPath)
            if ((propertyKey == rootPath || propertyKey.startsWith(rootPath+".") || rootPath == "") && propertyKey.indexOf(".$shadow", rootPath.length) == -1)
            {
                listeners           = bag.listenersByRootPath[rootPath];
                listenerIds         = Object.keys(listeners);
                for(var listenerIdCounter=0,listener;(listener=listeners[listenerIds[listenerIdCounter++]]) !== undefined;)
                    if (listener.callback !== undefined && !listener.callback.ignore)   listenersToNotify[listener.id]  = listener;
            }

            listenerIds             = Object.keys(listenersToNotify);
            //console.log((directOnly?"Directly":"Indirectly") + " notifying " + listenerIds.length + " listeners for changes to property located at `" + propertyKey + "`.");
            for(var listenerIdCounter=0,listener;(listener=listenersToNotify[listenerIds[listenerIdCounter++]]) !== undefined;)
            if(listener.callback !== undefined && !listener.callback.ignore)    notifyPropertyListener.call(this, listener, bag, value);
            
            notifyLinkedObserverPaths.call(this, propertyKey, value, bag);
        }
        function notifyLinkedObserverPaths(propertyKey, value, bag)
        {
            bag.__updatingLinkedObservers   = true;
            var linkedPaths = Object.keys(bag.linkedObservers);
            if (linkedPaths.length > 0)
            {
                var resolvedPropertyKeyPath     = this.observe(propertyKey)("$rootPath");
                for(var counter=0;counter<linkedPaths.length;counter++)
                {
                    var linkedPath  = linkedPaths[counter];
                    if (linkedPath === resolvedPropertyKeyPath  || linkedPath.startsWith(resolvedPropertyKeyPath+(resolvedPropertyKeyPath.length > 0 ? "." : "")))   updateLinkedObservers.call(this, bag.linkedObservers[linkedPath], this.unwrap(linkedPath))
                    else if(linkedPath === "$root"              || resolvedPropertyKeyPath.startsWith(linkedPath + (linkedPath.length > 0 ? "." : "")))              notifyLinkedObservers.call(this, bag.linkedObservers[linkedPath], linkedPath === "$root" ? propertyKey : linkedPath.length > 0 ? resolvedPropertyKeyPath.substr(linkedPath.length + 1) : propertyKey, value);
                }
            }
            bag.__updatingLinkedObservers   = false;
        }
        function updateLinkedObservers(linkedChildObservers, value)
        {
            for(var linkedChildObserverCounter=0,linkedChildObserver;(linkedChildObserver = linkedChildObservers[linkedChildObserverCounter++]) !== undefined;)
            for(var pathCounter=0,path;(path=linkedChildObserver.paths[pathCounter++]) !== undefined;)
            linkedChildObserver.childObserver(path, value);
        }
        function notifyLinkedObservers(linkedChildObservers, propertyPath, value)
        {
            for(var linkedChildObserverCounter=0,linkedChildObserver;(linkedChildObserver = linkedChildObservers[linkedChildObserverCounter++]) !== undefined;)
            for(var pathCounter=0,path;(path=linkedChildObserver.paths[pathCounter++]) !== undefined;)
            linkedChildObserver.childObserver.__notifyLinkUpdate(path + (path.length > 0 && propertyPath.length > 0 ? "." : "") + propertyPath, value);
        }
        function getItemChanges(oldItems, newItems)
        {
            var changes = {changed: [], items: newItems};
            for(var counter=0;counter<newItems.length;counter++)
            {
                if (oldItems.length<=counter||oldItems[counter]!==newItems[counter])    changes.changed.push(counter);
            }
            return changes;
        }
        function swap(index, toIndex)
        {
            var item    = this[index];
            removeFromArray(this, index);
            this.splice(toIndex, 0, item);
        }
        function filterMatchedByMatcher(paths, counter, matcher)
        {
            for(var pathCounter=paths.length-1,path;(path=paths[pathCounter--]) !== undefined;)
            if (!matcher.test(path))    paths.splice(pathCounter, 1);
        }
        function filterMatchedByPathSegment(paths, counter, pathSegment)
        {
            for(var pathCounter=paths.length-1,path;(path=paths[pathCounter]) !== undefined;pathCounter--)
            if (path.length <= counter || path[counter] !== pathSegment)    paths.splice(pathCounter, 1);
        }
        var regExMatch  = /^\/.*\/$/;
        each([objectObserverFunctionFactory,arrayObserverFunctionFactory],function(functionFactory){Object.defineProperties(functionFactory.root.prototype,
        {
            __invoke:           {value: function(path, value, getObserver, peek, forceSet, silentUpdate)
            {
                var accessor        = pathParser.parse(path);

                if (value === undefined && !forceSet)
                {
                    var result      = accessor.get({bag: this.__bag, basePath: this.__basePath}, (!peek && this.__bag.updating.length > 0 ? (function(pathSegments){addProperties(this.__bag, pathSegments);}).bind(this) : undefined));
                    var revisedPath = result.pathSegments !== undefined ? result.pathSegments.join(".") : undefined;
                    return getObserver !== getObserverEnum.no && (getObserver===getObserverEnum.yes||(path !== undefined && revisedPath !== undefined && result.value !== null && typeof result.value == "object"))
                    ?   createObserver(revisedPath, this.__bag, Array.isArray(result.value))
                    :   getObserver === getObserverEnum.no && result.value && result.value.isObserver ? result.value() : result.value;
                }

                if (this.__bag.rollingback) return;
                var currentValue    = accessor.get({bag: this.__bag, basePath: this.__basePath});
                if (value !== currentValue.value)
                {
                    accessor.set({bag: this.__bag, basePath: this.__basePath}, value, (function(revisedPath){if (!silentUpdate) notifyPropertyListeners.call(this, revisedPath, value, this.__bag, false);}).bind(this));
                }
            }},
            __notify:           {value: function(path, changes, directOnly)
            {
                for(var counter=0;counter<changes.changed.length;counter++) notifyPropertyListeners.call(this, path+"."+changes.changed[counter], changes.items[changes.changed[counter]], this.__bag, directOnly);
                notifyPropertyListeners.call(this, path, changes.items, this.__bag, true);
            }},
            __notifyLinkUpdate: {value: function(path, value)   { notifyPropertyListeners.call(this, path, value, this.__bag, false); }},
            delete:             {value: function(path, silent){this.__invoke(path, undefined, undefined, undefined, true, silent);}},
            equals:             {value: function(other){return other !== undefined && other !== null && this.__bag === other.__bag && this.__basePath === other.__basePath;}},
            observe:            {value: function(path, peek){return this.__invoke(path, undefined, getObserverEnum.yes, peek);}},
            peek:               {value: function(path, unwrap){return this.__invoke(path, undefined, unwrap === true ? getObserverEnum.no : getObserverEnum.auto, true);}},
            read:               {value: function(path, peek){return this.__invoke(path, undefined, getObserverEnum.auto, peek);}},
            unwrap:             {value: function(path){return this.__invoke(path, undefined, getObserverEnum.no, false);}},
            basePath:           {value: function(){return this.__basePath;}},
            shadows:            {get:   function(){return this.__bag.shadows;}},
            beginTransaction:   {value: function(){this.__bag.backup   = JSON.parse(JSON.stringify(this.__bag.item));}},
            commit:             {value: function(){delete this.__bag.backup;}},
            define:             {value: function(path, property)
            {
                var current = this.__bag.virtualProperties;
                if (property && typeof property.get === "function"||typeof property.set === "function")
                {
                    var virtualProperty = {cachedValues: {}};
                    if (property.get !== undefined) virtualProperty.get = (function(basePath, key)
                    {
                        var path = basePath + ((basePath||"").length > 0 && (key||"").length > 0 ? "." : "") + key;
                        if (virtualProperty.cachedValues[path] === undefined)
                        {
                            virtualProperty.cachedValues[path]  = { listener: (function()
                            {
                                var oldValue                                = virtualProperty.cachedValues[path].value;
                                virtualProperty.cachedValues[path].value    = property.get.call(createObserver(basePath, this.__bag, false), key);
                                if (virtualProperty.cachedValues[path].value === oldValue)  return;
                                notifyPropertyListeners.call(this, path, virtualProperty.cachedValues[path].value, this.__bag, false);
                            }).bind(this)};
                            this.listen(virtualProperty.cachedValues[path].listener);
                        }
                        return virtualProperty.cachedValues[path].value;
                    }).bind(this);
                    if (property.set !== undefined) virtualProperty.set = (function(basePath, key, value){return property.set.call(createObserver(basePath, this.__bag, false), key, value);}).bind(this);

                    var pathSegments    = this.__basePath.split(".").concat((path||"").split(/\.|(\/.*?\/)/g)).filter(function(s){return s!=null&&s.length>0;});
                    var currentMatched  = Object.keys(this.__bag.listenersByPath).map(function(path){return path.split(".");}).concat(Object.keys(this.__bag.linkedObservers).map(function(path){return path.substr(6).split(".");}));
                    for(var counter=0;counter<pathSegments.length;counter++)
                    {
                        var pathSegment = pathSegments[counter];
                        if (regExMatch.test(pathSegment))
                        {
                            var matcher = undefined;
                            for(var matcherCounter=0;matcherCounter<current.matchers.length;matcherCounter++)
                            if (current.matchers[matcherCounter].key === pathSegment)
                            {
                                matcher = current.matchers[matcherCounter];
                                break;
                            }

                            if (counter==pathSegments.length-1)
                            {
                                if (matcher !== undefined)
                                {
                                    console.warn("Redefining virtualProperty located at " + (this.__basePath + (this.__basePath.length > 0 ? "." : "") + path) + ".");
                                    matcher.property    = virtualProperty;
                                    filterMatchedByMatcher(currentMatched, counter, matcher);
                                }
                                else
                                {
                                    current.matchers.push
                                    ({
                                        key:        pathSegment,
                                        test:       (function(criteria){return function(path){return criteria.test(path);}})(new RegExp(pathSegment.substring(1,pathSegment.length-1))),
                                        property:   virtualProperty,
                                        paths:      {},
                                        matchers:   []
                                    });
                                    filterMatchedByMatcher(currentMatched, counter, current.matchers[current.matchers.length-1]);
                                    break;
                                }
                            }
                            else
                            {
                                if (matcher === undefined)
                                {
                                    matcher     =
                                    {
                                        key:        pathSegment,
                                        test:       (function(criteria){return function(path){return criteria.test(path);}})(new RegExp(pathSegment.substring(1,pathSegment.length-1))),
                                        paths:      {}, 
                                        matchers:   []
                                    };
                                    current.matchers.push(matcher);
                                }

                                current         = matcher;
                                filterMatchedByMatcher(currentMatched, counter, matcher);
                            }
                        }
                        else
                        {
                            if (current.paths[pathSegment] === undefined)   current.paths[pathSegment]    = {paths:{}, matchers:[]};
                            if (counter==pathSegments.length-1)
                            {
                                current.paths[pathSegment].property = virtualProperty;
                                filterMatchedByPathSegment(currentMatched, counter, pathSegment);
                                break;
                            }
                            else
                            {
                                current = current.paths[pathSegment];
                                filterMatchedByPathSegment(currentMatched, counter, pathSegment);
                            }
                        }
                    }
                    for(var pathCounter=0,path;(path=currentMatched[pathCounter++]) !== undefined;) notifyPropertyListeners.call(this, path.join("."), this.__bag.item, this.__bag, false);
                }
            }},
            ignore:             {value: function(callback)
            {
                var callbackFound   = false;
                for(var listenerCounter=this.__bag.listeners.length-1;listenerCounter>=0;listenerCounter--)
                {
                    var listener    = this.__bag.listeners[listenerCounter];
                    if (listener.callback === callback)
                    {
                        removeFromArray(this.__bag.listeners, listenerCounter);
                        unregisterListenerFromProperties(this.__bag, listener);
                        if (listener.nestedUpdatesRootPath !== undefined)
                        {
                            var listenersByRootPath = this.__bag.listenersByRootPath[listener.nestedUpdatesRootPath];
                            for(var listenerByRootPathCounter=listenersByRootPath.length-1;listenerByRootPathCounter>=0;listenerByRootPathCounter--)
                            if(listenersByRootPath[listenerByRootPathCounter] == listener)  removeFromArray(listenersByRootPath, listenerByRootPathCounter);
                        }
                        delete listener.id;
                        delete listener.callback;
                        delete listener.observer;
                        delete listener.properties;
                        delete listener.nestedUpdatesRootPath;
                        callbackFound   = true;
                    }
               }
                if (!callbackFound) debugger;
            }},
            isObserver:         {value: true},
            link:               {value: function(rootPath, childObserver, childRootPath, skipLinkBack)
            {
                var resolvedObserver        = this.observe(rootPath);
                rootPath                    = resolvedObserver("$rootPath");
                var linkedChildObservers    = this.__bag.linkedObservers[rootPath] = this.__bag.linkedObservers[rootPath]||[];
                var linkedChildObserver     = undefined;

                for(var linkedChildObserverCounter=0;(linkedChildObserver = linkedChildObservers[linkedChildObserverCounter++]) !== undefined;) if (linkedChildObserver.childObserver == childObserver) break;

                if (linkedChildObserver === undefined)                          linkedChildObservers.push({childObserver: childObserver, paths: [childRootPath]});
                else if(linkedChildObserver.paths.indexOf(childRootPath) == -1) linkedChildObserver.paths.push(childRootPath);

                if (skipLinkBack)   return;

                childObserver.link(childRootPath, this, rootPath, true);
                childObserver(childRootPath, resolvedObserver.unwrap());
            }},
            listen:             {value: function(callback, nestedUpdatesRootPath)
            {
                var listener    =
                {
                    id:                     this.__bag.listenerId++,
                    callback:               callback, 
                    observer:               this,
                    properties:             {},
                    nestedUpdatesRootPath:  nestedUpdatesRootPath !== undefined
                                            ?   ((this.__basePath||"")+(this.__basePath && this.__basePath.length>0&&nestedUpdatesRootPath.length>0&&nestedUpdatesRootPath.substr(0,1)!=="."?".":"")+nestedUpdatesRootPath)
                                            :   undefined
                };
                this.__bag.listeners.push(listener);
                if (listener.nestedUpdatesRootPath !== undefined)
                {
                    if (this.__bag.listenersByRootPath[listener.nestedUpdatesRootPath] === undefined)   this.__bag.listenersByRootPath[listener.nestedUpdatesRootPath]  = [listener];
                    else                                                                                this.__bag.listenersByRootPath[listener.nestedUpdatesRootPath].push(listener);
                }
                notifyPropertyListener.call(this, listener, this.__bag);
            }},
            notify:             {value: function(path, directOnly){notifyPropertyListeners.call(this, path, this.unwrap(path), this.__bag, directOnly);}},
            rollback:           {value: function()
            {
                this.__bag.rollingback  = true;
                this.__bag.item         = this.__bag.backup;
                delete this.__bag.backup;
                notifyPropertyListeners.call(this, this.__basePath, this.__bag.item, this.__bag, false);
                this.__bag.rollingback  = false;
            }},
            setValue:           {value: function(path, value, silent){this.__invoke(path, value, undefined, undefined, true, silent);}},
            toString:           {value: function(){ return " Atomic Observer bound to path: `" + this.__basePath + "`; If you are seeing this, you might have bound a value based property to an object within the observer."; }},
            transform:          {value: function(path, property)
            {
                var accessor    = pathParser.parse(path);
                var that        = this;
                this.define(path, {get: function(key)
                {
                    return property.to(accessor.get({bag: that.__bag, basePath: that.__basePath}, undefined, true).value);
                }});
                this.listen((function()
                {
                    var virtual = accessor.get
                    (
                        {bag: this.__bag, basePath: this.__basePath},
                        this.__bag.updating.length > 0
                        ?   (function(pathSegments){addProperties(this.__bag, pathSegments);}).bind(this)
                        :   undefined
                    );
                    var value = property.back(virtual.value);
                    accessor.set({bag: this.__bag, basePath: this.__basePath}, value, undefined, true);
                }).bind(this), path);
            }},
            unlink:             {value: function(rootPath, childObserver, childRootPath, skipLinkBack)
            {
                rootPath                    = this.observe(rootPath)("$path");
                var linkedChildObservers    = this.__bag.linkedObservers[rootPath] = this.__bag.linkedObservers[rootPath]||[];
                var linkedChildObserver     = undefined;

                for(var linkedChildObserverCounter=0;(linkedChildObserver = linkedChildObservers[linkedChildObserverCounter++]) !== undefined;) if (linkedChildObserver.childObserver == childObserver) break;

                if (linkedChildObserver === undefined)  return;
                
                var pathIndex;
                if((pathIndex = linkedChildObserver.paths.indexOf(childRootPath)) != -1)    linkedChildObserver.paths.splice(pathIndex, 1);

                if (skipLinkBack)   return;

                childObserver.unlink(childRootPath, this, rootPath, true);
            }}
        });});
        each(["push","pop","shift","unshift","sort","reverse","splice"], function(name)
        {
            Object.defineProperty
            (
                arrayObserverFunctionFactory.root.prototype, 
                name, 
                {
                    value: function()
                    {
                        var items       = this();
                        var oldItems    = items.slice();
                        var result      = items[name].apply(items, arguments);

                        this.__notify(this.__basePath, getItemChanges(oldItems, items), false);
                        if(name!=="sort" && name!=="reverse")   notifyPropertyListeners.call(this, this.__basePath + ".length", items.length, this.__bag, true);
                        return result === items ? this : result; 
                    }
                }
            );
        });
        each(["remove","removeAll","move","swap"], function(name)
        {
            Object.defineProperty
            (
                arrayObserverFunctionFactory.root.prototype,
                name, 
                {
                    value: function()
                    {
                        var items       = this();
                        var oldItems    = items.slice();
                        var result      = this["__"+name].apply(this, arguments); 
                        this.__notify(this.__basePath, getItemChanges(oldItems, items), false);
                        notifyPropertyListeners.call(this, this.__basePath + ".length", items.length, this.__bag, true);
                        return result; 
                    }
                }
            );
        });
        each(["join","indexOf","slice"], function(name)
        {
            Object.defineProperty
            (
                arrayObserverFunctionFactory.root.prototype, 
                name, 
                {
                    value: function()
                    {
                        var items   = this.unwrap(); 
                        return items[name].apply(items, arguments);
                    }
                }
            );
        });
        Object.defineProperties(arrayObserverFunctionFactory.root.prototype,
        {
            __move:             {value: function(value, toIndex)
            {
                var items   = this();
                if (!Array.isArray(items))  throw new Error("Observer does not wrap an Array.");
                swap.call(items, items.indexOf(value), toIndex);
            }},
            __swap:             {value: function(index, toIndex)
            {
                var items   = this();
                if (!Array.isArray(items))  throw new Error("Observer does not wrap an Array.");
                swap.call(items, index, toIndex);
            }},
            __remove:           {value: function(value)
            {
                var items   = this();
                if (!Array.isArray(items))  throw new Error("Observer does not wrap an Array.");
                removeFromArray(items, items.indexOf(value));
            }},
            __removeAll:        {value: function(values)
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
            }},
            filter:             {value: function(filter)
            {
                var items       = this();
                var filtered    = [];
                for(var counter=0;counter<items.length;counter++)   if (filter(items[counter])) filtered.push(items[counter]);
                return filtered;
            }},
            isArrayObserver:    {value: true},
            count:              {get: function(){return this("length");}},
            reduce:             {value: function(callback, initialValue)
            {
                var returnValue = initialValue;
                var count       = this.count;
                var items       = Object(this.unwrap());
                for (var counter=0;counter<count;counter++) if(counter in items)    returnValue = callback(returnValue, this(counter), counter, this());
                return returnValue;
            }}
        });
        return createObserver;
    }
    root.define("atomic.observerFactory", function(removeFromArray, isolatedFunctionFactory, each, pathParser)
    {
        if (createObserver === undefined)  createObserver   = buildConstructor(removeFromArray, isolatedFunctionFactory, each, pathParser);
        return function observer(_item)
        {
            var bag             =
            {
                item:                   _item,
                virtualProperties:      {paths:{}, matchers: []},
                listenerId:             0,
                listenersByPath:        {},
                listenersByRootPath:    {},
                linkedObservers:        {},
                listeners:              [],
                propertyKeys:           [],
                updating:               [],
                shadows:                {},
                rollingback:            false
            };
            return createObserver("", bag, Array.isArray(_item));
        };
    });
}();