!function()
{
    "use strict";
    var createObserver;
    function buildConstructor(removeFromArray, isolatedFunctionFactory, each)
    {
        var getObserverEnum                             = {auto: 0, no: -1, yes: 1};
        var objectObserverFunctionFactory               = new isolatedFunctionFactory();
        var objectObserver                              =
        objectObserverFunctionFactory.create
        (function objectObserver(basePath, bag)
        {if (basePath==undefined) debugger;
            Object.defineProperties(this,
            {
                ___invoke:  {value: function(path, value){return this.__invoke(path, value, getObserverEnum.auto);}},
                __basePath: {get:   function(){return basePath;}},
                __bag:      {get:   function(){return bag;}},
                isDefined:  {value: function(propertyName){return this(propertyName)!==undefined;}},
                hasValue:   {value: function(propertyName){var value=this(propertyName); return value!==undefined && !(!value);}}
            });
            return this;
        });
        var arrayObserverFunctionFactory                = new isolatedFunctionFactory();
        var arrayObserver                               =
        arrayObserverFunctionFactory.create
        (function arrayObserver(basePath, bag)
        {
            //function each(array, callback) { for(var arrayCounter=0;arrayCounter<array.length;arrayCounter++) callback(array[arrayCounter], arrayCounter); }
            Object.defineProperties(this,
            {
                ___invoke:  {value: function(path, value){return this.__invoke(path, value, getObserverEnum.auto);}},
                __basePath: {get:   function(){return basePath;}},
                __bag:      {get:   function(){return bag;}}
            });
            return this;
        });
        function createObserver(revisedPath, bag, isArray)
        {
            return new (isArray?arrayObserver:objectObserver)(revisedPath, bag);
        }
        function getValue(pathSegments, revisedPath, getObserver)
        {
            pathSegments    = pathSegments || [""];
            if (this.__bag.updating.length > 0) addProperties(this.__bag.updating[this.__bag.updating.length-1].properties, pathSegments);
            var returnValue = navDataPath(this.__bag, pathSegments);
            if (getObserver !== getObserverEnum.no && (getObserver===getObserverEnum.yes||(revisedPath !== undefined && returnValue !== null && typeof returnValue == "object"))) return createObserver(revisedPath||"", this.__bag, Array.isArray(returnValue));
            return returnValue;
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
        {if(typeof path.split !== "function") debugger;
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
                if (current[path.value] === undefined)
                {
                    if (value !== undefined)    current[path.value]   = path.type===0?{}:[];
                    else                        return undefined;
                }
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
            if (pathSegments.length === 0)  return;
            var path    = pathSegments[0].value;
            addPropertyPath(properties, path, getFullPath(pathSegments.slice(1)));
            for(var segmentCounter=1;segmentCounter<pathSegments.length;segmentCounter++)
            {
                path    += "." + pathSegments[segmentCounter].value;
                addPropertyPath(properties, path, getFullPath(pathSegments.slice(segmentCounter+1)));
            }
        }
        function notifyPropertyListener(propertyKey, listener, bag, directOnly)
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
                listener.properties = {};
                var postCallback = listener.callback();
                bag.updating.pop();
                if (postCallback !== undefined) postCallback();
            }
        }
        function notifyPropertyListeners(propertyKey, value, bag, directOnly)
        {
            var itemListeners   = bag.itemListeners.slice();
            for(var listenerCounter=0;listenerCounter<itemListeners.length;listenerCounter++)   notifyPropertyListener.call(this, propertyKey, itemListeners[listenerCounter], bag, directOnly);
        }
        each([objectObserverFunctionFactory,arrayObserverFunctionFactory],function(functionFactory){Object.defineProperties(functionFactory.root.prototype,
        {
            __invoke:           {value: function(path, value, getObserver)
            {
                if (path === "..." && value === undefined)      {return getValue.call(this, [], undefined, getObserver);}
                if (path === undefined && value === undefined)  return getValue.call(this, extractPathSegments(this.__basePath), undefined, getObserver);
                if (path === undefined || path === null)        path    = "";
                var resolvedPath    =   typeof path === "string" && path.substr(0,3) === "..."
                                        ?   path.substr(3)
                                        :   this.__basePath + (typeof path === "string" && path.substr(0, 1) === "." ? "" : ".") + path.toString();
                var pathSegments    = extractPathSegments(resolvedPath);
                var revisedPath     = getFullPath(pathSegments);
                if (value === undefined)    return getValue.call(this, pathSegments, revisedPath, getObserver);
                if (this.__bag.rollingback) return;
                var currentValue = navDataPath(this.__bag, pathSegments);
                if (value !== currentValue)
                {
                    navDataPath(this.__bag, pathSegments, value);
                    notifyPropertyListeners.call(this, revisedPath, value, this.__bag, false);
                }
            }},
            __notify:           {value: function(path, changes, directOnly){notifyPropertyListeners.call(this, path, changes, this.__bag, directOnly);}},
            observe:            {value: function(path){return this.__invoke(path, undefined, getObserverEnum.yes);}},
            unwrap:             {value: function(path){return this.__invoke(path, undefined, getObserverEnum.no);}},
            basePath:           {value: function(){return this.__basePath;}},
            beginTransaction:   {value: function(){this.__bag.backup   = JSON.parse(JSON.stringify(this.__bag.item));}},
            commit:             {value: function(){delete this.__bag.backup;}},
            ignore:             {value: function(callback)
            {
                for(var listenerCounter=this.__bag.itemListeners.length-1;listenerCounter>=0;listenerCounter--)
                if (this.__bag.itemListeners[listenerCounter].callback === callback)
                removeFromArray(this.__bag.itemListeners, listenerCounter);
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
                        var result      = items[name].apply(items, arguments);
                        this.__notify(this.__basePath, items, name!=="sort"&&name!=="reverse"); 
                        return result === items ? this : result; 
                    }
                }
            );
        });
        each(["remove","removeAll"], function(name)
        {
            Object.defineProperty
            (
                arrayObserverFunctionFactory.root.prototype,
                name, 
                {
                    value: function()
                    {
                        var result      = this["__"+name].apply(this, arguments); 
                        this.__notify(this.__basePath, this(), true);
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
                        var items   = this(); 
                        return items[name].apply(items, arguments);
                    }
                }
            );
        });
        Object.defineProperties(arrayObserverFunctionFactory.root.prototype,
        {
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
            isArrayObserver:    {value: true},
            count:              {get: function(){return this().length;}}
        });
        return createObserver;
    }
    root.define("atomic.observerFactory", function(removeFromArray, isolatedFunctionFactory, each)
    {
        if (createObserver === undefined)  createObserver   = buildConstructor(removeFromArray, isolatedFunctionFactory, each);
        return function observer(_item)
        {
            var bag             =
            {
                item:           _item,
                itemListeners:  [],
                rootListeners:  [],
                propertyKeys:   [],
                updating:       [],
                rollingback:    false
            };
            return createObserver("", bag, Array.isArray(_item));
        };
    });
}();