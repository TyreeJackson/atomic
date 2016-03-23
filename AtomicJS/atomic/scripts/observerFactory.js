/*
outstanding issues:
support string key paths in observable
add routing
*/
!function()
{"use strict";root.define("atomic.observerFactory", function(removeFromArray, isolatedFunctionFactory)
{
    var functionFactory = new isolatedFunctionFactory();
    var subObserver                                 =
    functionFactory.create
    (function subObserverFactory(basePath, bag, isArray)
    {
        function subObserver(path, value)
        {
            return subObserver.__invoke(path, value);
        }
        Object.defineProperty(subObserver, "__basePath", {get:function(){return basePath;}});
        Object.defineProperty(subObserver, "__bag", {get:function(){return bag;}});
        if (isArray)
        {
            Object.defineProperty(subObserver, "push", {get:function(){return function(item){ var items = this(); items.push(item); this.__notify(this.__basePath, items); }}});
            Object.defineProperty(subObserver, "pop", {get:function(){return function(){ var items = this(); items.pop(); this.__notify(this.__basePath, items); }}});
            Object.defineProperty(subObserver, "shift", {get:function(){return function(item){ var items = this(); items.shift(item); this.__notify(this.__basePath, items); }}});
            Object.defineProperty(subObserver, "unshift", {get:function(){return function(){ var items = this(); items.unshift(); this.__notify(this.__basePath, items); }}});
            Object.defineProperty(subObserver, "remove", {get:function(){return function(item){ this.__remove(item); }}});
        }
        //Object.defineProperty(subObserver, "toString", {get:function(){debugger; throw new Error("You shouldn't be here.");}});
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
            if (returnValue !== null && typeof returnValue == "object") return new subObserver(revisedPath, this.__bag, Array.isArray(returnValue));
            return returnValue;
        }
        if (this.__bag.rollingback)    return;
        var currentValue = navDataPath(this.__bag, pathSegments);
        if (value !== currentValue)
        {
            navDataPath(this.__bag, pathSegments, value);
            notifyPropertyListeners.call(this, revisedPath, value, this.__bag);
        }
    }
    functionFactory.root.prototype.basePath         = function(){return this.__basePath;};
    functionFactory.root.prototype.__remove         =
    function(value)
    {
        var items   = this();
        if (!Array.isArray(items))  throw new Error("Observer does not wrap an Array.");
        removeFromArray(items, items.indexOf(value));
        this.__notify(this.__basePath, items);
    }
    functionFactory.root.prototype.__notify         =
    function(path, value)
    {
        notifyPropertyListeners.call(this, path, value, this.__bag);
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
        if (listener.callback !== undefined && !listener.callback.ignore && (propertyKey == "" || (listener.properties !== undefined && listener.properties.hasOwnProperty(propertyKey))))
        {
            bag.updating.push(listener);
            listener.properties = {};
            var postCallback = listener.callback();
            bag.updating.pop();
            if (postCallback !== undefined) postCallback();
        }
    }
    function notifyPropertyListeners(propertyKey, value, bag)
    {
        var itemListeners   = bag.itemListeners.slice();
        for(var listenerCounter=0;listenerCounter<itemListeners.length;listenerCounter++)   notifyPropertyListener.call(this, propertyKey, itemListeners[listenerCounter], bag);
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
        return new subObserver("", bag, Array.isArray(_item));
    };
});}();