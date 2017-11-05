!function()
{
    "use strict";
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
        function addPropertyPath(properties, path, remainingPath)
        {
            properties[path]    = remainingPath !== undefined ? remainingPath : "";
        }
        function addProperties(properties, pathSegments)
        {
            addPropertyPath(properties, "", getFullPath(pathSegments.slice(0)));
            if (pathSegments.length === 0)  return;
            var path    = pathSegments[0];
            addPropertyPath(properties, path, getFullPath(pathSegments.slice(1)));
            for(var segmentCounter=1;segmentCounter<pathSegments.length;segmentCounter++)
            {
                path    += "." + pathSegments[segmentCounter];
                addPropertyPath(properties, path, getFullPath(pathSegments.slice(segmentCounter+1)));
            }
        }
        function notifyPropertyListener(propertyKey, listener, bag, directOnly, value)
        {
            if
            (
                listener.callback !== undefined
                &&
                !listener.callback.ignore
                &&
                (
                    propertyKey == "" 
                    ||
                    (
                        listener.nestedUpdatesRootPath !== undefined
                        &&
                        propertyKey.substr(0, listener.nestedUpdatesRootPath.length) === listener.nestedUpdatesRootPath
                        &&
                        propertyKey.indexOf(".$shadow", listener.nestedUpdatesRootPath.length) == -1
                    )
                    ||
                    (
                        listener.properties !== undefined
                        &&
                        listener.properties.hasOwnProperty(propertyKey)
                        &&
                        (
                            !directOnly
                            ||
                            listener.properties[propertyKey] === ""
                        )
                    )
                )
            )
            {
                bag.updating.push(listener);
                // useful for debugging.  I should consider a hook that allows debuggers to report on why re-evaluation of bound properties occur: var oldProperties   = listener.properties; listener.properties = {};
                var postCallback = listener.callback(value);
                bag.updating.pop();
                if (postCallback !== undefined) postCallback();
            }
        }
        function notifyPropertyListeners(propertyKey, value, bag, directOnly)
        {
            var itemListeners   = bag.itemListeners.slice();
            for(var listenerCounter=0;listenerCounter<itemListeners.length;listenerCounter++)   
                notifyPropertyListener.call(this, propertyKey, itemListeners[listenerCounter], bag, directOnly, value);
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
        var regExMatch  = /^\/.*\/$/g;
        each([objectObserverFunctionFactory,arrayObserverFunctionFactory],function(functionFactory){Object.defineProperties(functionFactory.root.prototype,
        {
            __invoke:           {value: function(path, value, getObserver, peek, forceSet)
            {
                var accessor        = pathParser.parse(path);

                if (value === undefined && !forceSet)
                {
                    var result      = accessor.get({bag: this.__bag, basePath: this.__basePath}, (!peek && this.__bag.updating.length > 0 ? (function(pathSegments){addProperties(this.__bag.updating[this.__bag.updating.length-1].properties, pathSegments);}).bind(this) : undefined));
                    var revisedPath = result.pathSegments !== undefined ? result.pathSegments.join(".") : undefined;
                    return getObserver !== getObserverEnum.no && (getObserver===getObserverEnum.yes||(path !== undefined && revisedPath !== undefined && result.value !== null && typeof result.value == "object"))
                    ?   createObserver(revisedPath, this.__bag, Array.isArray(result.value))
                    :   result.value;
                }

                if (this.__bag.rollingback) return;
                var currentValue    = accessor.get({bag: this.__bag, basePath: this.__basePath});
                if (value !== currentValue.value)
                {
                    accessor.set({bag: this.__bag, basePath: this.__basePath}, value, (function(revisedPath){notifyPropertyListeners.call(this, revisedPath, value, this.__bag, false);}).bind(this));
                }
            }},
            __notify:           {value: function(path, changes, directOnly)
            {
                for(var counter=0;counter<changes.changed.length;counter++) notifyPropertyListeners.call(this, path+"."+changes.changed[counter], changes.items[changes.changed[counter]], this.__bag, directOnly);
                notifyPropertyListeners.call(this, path, changes.items, this.__bag, true);
            }},
            delete:             {value: function(path){this.__invoke(path, undefined, undefined, undefined, true);}},
            equals:             {value: function(other){return other !== undefined && other !== null && this.__bag === other.__bag && this.__basePath === other.__basePath;}},
            observe:            {value: function(path){return this.__invoke(path, undefined, getObserverEnum.yes, false);}},
            peek:               {value: function(path){return this.__invoke(path, undefined, getObserverEnum.auto, true);}},
            read:               {value: function(path, peek){return this.__invoke(path, undefined, getObserverEnum.auto, peek);}},
            unwrap:             {value: function(path){return this.__invoke(path, undefined, getObserverEnum.no, false);}},
            basePath:           {value: function(){return this.__basePath;}},
            shadows:            {get: function(){return this.__bag.shadows;}},
            beginTransaction:   {value: function(){this.__bag.backup   = JSON.parse(JSON.stringify(this.__bag.item));}},
            commit:             {value: function(){delete this.__bag.backup;}},
            define:             
            {value: function(path, property, overwrite)
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
                                virtualProperty.cachedValues[path].value = property.get.call(createObserver(basePath, this.__bag, false), key);
                                notifyPropertyListeners.call(this, path, virtualProperty.cachedValues[path].value, this.__bag, false);
                            }).bind(this)};
                            this.listen(virtualProperty.cachedValues[path].listener);
                        }
                        return virtualProperty.cachedValues[path].value;
                    }).bind(this);
                    if (property.set !== undefined) virtualProperty.set = (function(basePath, key, value){return property.set.call(createObserver(basePath, this.__bag, false), key, value);}).bind(this);

                    var pathSegments    = this.__basePath.split(".").concat((path||"").split(/\.|(\/.*\/)/g)).filter(function(s){return s!=null&&s.length>0;});
                    for(var counter=0;counter<pathSegments.length;counter++)
                    {
                        var pathSegment = pathSegments[counter];
                        if (regExMatch.test(pathSegment))
                        {
                            var matcher;
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
                                    matcher.property    = virtualProperty;
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
                                    return;
                                }
                            }
                            else
                            {
                                if (matcher === undefined)
                                {
                                    matcher =
                                    {
                                        key:        pathSegment,
                                        test:       (function(criteria){return function(path){return criteria.test(path);}})(new RegExp(pathSegment.substring(1,pathSegment.length-1))),
                                        paths:      {}, 
                                        matchers:   []
                                    };
                                    current.matchers.push(matcher);
                                }

                                current = matcher;
                            }
                        }
                        else
                        {
                            if (current.paths[pathSegment] === undefined)   current.paths[pathSegment]    = {paths:{}, matchers:[]};
                            if (counter==pathSegments.length-1)
                            {
                                current.paths[pathSegment].property = virtualProperty;
                                return;
                            }
                            else
                            {
                                current = current.paths[pathSegment];
                            }
                        }
                    }
                }
            }},
            ignore:             {value: function(callback)
            {
                var callbackFound   = false;
                for(var listenerCounter=this.__bag.itemListeners.length-1;listenerCounter>=0;listenerCounter--)
                if (this.__bag.itemListeners[listenerCounter].callback === callback)
                {
                    removeFromArray(this.__bag.itemListeners, listenerCounter);
                    callbackFound   = true;
                }
                if (!callbackFound) debugger;
            }},
            isObserver:         {value: true},
            listen:             {value: function(callback, nestedUpdatesRootPath)
            {
                var listener    = {callback: callback, nestedUpdatesRootPath: nestedUpdatesRootPath!==undefined?((this.__basePath||"")+(this.__basePath && this.__basePath.length>0&&nestedUpdatesRootPath.length>0&&nestedUpdatesRootPath.substr(0,1)!=="."?".":"")+nestedUpdatesRootPath):undefined};
                this.__bag.itemListeners.push(listener);
                notifyPropertyListener.call(this, "", listener, this.__bag, false);
            }},
            rollback:           {value: function()
            {
                this.__bag.rollingback  = true;
                this.__bag.item         = this.__bag.backup;
                delete this.__bag.backup;
                notifyPropertyListeners.call(this, this.__basePath, this.__bag.item, this.__bag, false);
                this.__bag.rollingback  = false;
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

                        this.__notify(this.__basePath, getItemChanges(oldItems, items), name==="sort" || name==="reverse");
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
            count:              {get: function(){return this().length;}}
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
                item:               _item,
                virtualProperties:  {paths:{}, matchers: []},
                itemListeners:      [],
                rootListeners:      [],
                propertyKeys:       [],
                updating:           [],
                shadows:            {},
                rollingback:        false
            };
            return createObserver("", bag, Array.isArray(_item));
        };
    });
}();