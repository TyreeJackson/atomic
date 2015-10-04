!function()
{
    root.define
    (
        "atomic.htmlAttachViewMemberAdapters",
        function htmlAttachViewMemberAdapters(document, removeItemFromArray, setTimeout, clearTimeout)
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
                        var subSegments = pathSegment.substring(bracket+1, pathSegment-2).split("][");
                        pathSegment     = pathSegment.substring(0, bracket-1);
                        returnSegments.push({type:1, value: pathSegment});
                        extractArrayPathSegmentsInto(subSegments, returnSegments, path);
                    }
                    else    returnSegments.push({type:0, value: pathSegment});
                }
                return returnSegments;
            }
            function navDataPath(root, path, value)
            {
                if (path === undefined) return root;
                var current     = root;
                var paths       = extractPathSegments(path);
                for(var pathCounter=0;pathCounter<paths.length-1;pathCounter++)
                {
                    var path    = paths[pathCounter];
                    if (current[path.value] === undefined)    current[path.value]   = path.type===0?{}:[];
                    current     = current[path.value];
                }
                if (value !== undefined)    current[paths[paths.length-1].value]    = value;
                else                        return current[paths[paths.length-1].value];
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
            function notifyOnbind(data)
            {
                if (this.__onbind)  this.__onbind(data);
            }
            var bindSourceFunctions  =
            {
                "default":
                function(sources)
                {
                    for(var controlKey in this.controls)    this.controls[controlKey].bindSource(sources);
                }
            };
            var bindDataFunctions  =
            {
                "default":
                function(data)
                {
                    if (this.__bindTo === undefined)    return;
                    this.value(navDataPath(data, this.__bindTo));
                    notifyOnbind.call(this, data);
                },
                container:
                function(data)
                {
                    var subData = navDataPath(data, this.__bindTo);
                    for(var controlKey in this.controls)    this.controls[controlKey].bindData(subData);
                    notifyOnbind.call(this, data);
                },
                repeater:
                function(data)
                {
                    var subData             = navDataPath(data, this.__bindTo);
                    var documentFragment    = document.createDocumentFragment();
                    this.__detach(documentFragment);
                    unbindRepeatedList.call(this);
                    for(var dataItemCounter=0;dataItemCounter<subData.length;dataItemCounter++)
                    {
                        var subDataItem = subData[dataItemCounter];
                        for(var templateKeyCounter=0;templateKeyCounter<this.__templateKeys.length;templateKeyCounter++)
                        {
                            var clone                       = this.__createTemplateCopy(this.__templateKeys[templateKeyCounter]);
                            var key                         = clone.getKey(subDataItem);
                            this.__repeatedControls[key]    = clone.control;
                            clone.control.bindData(subData[dataItemCounter]);
                            clone.parent.appendChild(clone.control.__element);
                        }
                    }
                    this.__reattach();
                    notifyOnbind.call(this, data);
                }
            };
            var unbindDataFunctions  =
            {
                "default":
                function()
                {
                    notifyOnbind.call(this);
                },
                container:
                function()
                {
                    for(var controlKey in this.controls)    this.controls[controlKey].unbindData();
                    notifyOnbind.call(this);
                },
                repeater:
                function()
                {
                    var documentFragment    = document.createDocumentFragment();
                    this.__detach(documentFragment);
                    unbindRepeatedList.call(this);
                    this.__reattach();
                    notifyOnbind.call(this, []);
                }
            };
            function htmlBasedValueFunc(value)
            {
                if (value !== undefined)    this.__element.innerHTML=value;
                else                        return this.__element.innerHTML;
            }
            var valueFunctions  =
            {
                "default":
                function(value)
                {
                    if (value !== undefined)    this.__element.value    = value;
                    else                        return this.__element.value;
                },
                "span":     htmlBasedValueFunc,
                "label":    htmlBasedValueFunc
            };
            function addClass(element, className, removeItemFromArray)
            {
                var classNames  = element.className.split(" ");
                if (classNames.indexOf(className) === -1) classNames.push(className);
                element.className = classNames.join(" ");
            }
            function removeClass(element, className, removeItemFromArray)
            {
                var classNames  = element.className.split(" ");
                if (classNames.indexOf(className) > -1) removeItemFromArray(classNames, className);
                element.className = classNames.join(" ");
            }
            function createElementListener(listeners)
            {
                return function() { for(var listenerCounter=0;listenerCounter<listeners.listeners.length;listenerCounter++)   listeners.listeners[listenerCounter].apply(null, arguments); };
            }
            function addListener(viewAdapter, eventName, listeners, listener, withCapture)
            {
                if (listeners.elementListener === undefined)
                {
                    listeners.elementListener   = createElementListener(listeners);
                    viewAdapter.__element.addEventListener(eventName, listeners.elementListener, withCapture);
                }
                listeners.listeners.push(listener);
            }
            function removeListener(viewAdapter, eventName, listeners, listener, withCapture, removeItemFromArray)
            {
                if (listeners.elementListener !== undefined)
                {
                    removeItemFromArray(listeners.listener, listener);
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
                var listenersUsingCapture       = {listeners: []};
                var listenersNotUsingCapture    = {listeners: []};

                viewAdapter.addClass            = function(className){ addClass(viewAdapter, className, removeItemFromArray); }
                viewAdapter.addEventListener    = function(eventName, listener, withCapture){ addListener(viewAdapter, eventName, (withCapture?listenersUsingCapture:listenersNotUsingCapture), listener, withCapture); };
                viewAdapter.appendControl       = function(childControl){ this.__element.appendChild(childControl.__element); };
                viewAdapter.bindSource          = bindSourceFunctions[viewAdapter.__element.nodeName.toLowerCase() + (viewAdapter.__element.type ? ":" + viewAdapter.__element.type.toLowerCase() : "")]||bindSourceFunctions.default;
                viewAdapter.bindData            = viewAdapter.__templateKeys ? bindDataFunctions.repeater : viewAdapter.controls ? bindDataFunctions.container : bindDataFunctions.default;
                viewAdapter.__detach            = function(documentFragment){viewAdapter.__elementParent = viewAdapter.__element.parentNode; documentFragment.appendChild(viewAdapter.__element);};
                viewAdapter.hide                = function(){ this.__element.style.display="none"; };
                viewAdapter.hideFor             = function(milliseconds){ this.hide(); setTimeout((function(){this.show();}).bind(this), milliseconds); };
                viewAdapter.removeClass         = function(className){ removeClass(viewAdapter, className, removeItemFromArray); }
                viewAdapter.removeControl       = function(childControl){ this.__element.removeChild(childControl.__element); };
                viewAdapter.removeListener      = function(eventName, listener, withCapture){ addListener(viewAdapter, eventName, (withCapture?listenersUsingCapture:listenersNotUsingCapture), listener, withCapture); };
                viewAdapter.__reattach          = function(){viewAdapter.__elementParent.appendChild(viewAdapter.__element);};
                viewAdapter.show                = function(){ this.__element.style.display=""; };
                viewAdapter.showFor             = function(milliseconds){ this.show(); setTimeout((function(){this.hide();}).bind(this), milliseconds); };
                viewAdapter.toggleDisplay       = function(condition){ this[condition?"show":"hide"](); };
                viewAdapter.unbindData          = viewAdapter.__templateKeys ? unbindDataFunctions.repeater : viewAdapter.controls ? unbindDataFunctions.container : unbindDataFunctions.default;
                viewAdapter.value               = valueFunctions[viewAdapter.__element.nodeName.toLowerCase() + (viewAdapter.__element.type ? ":" + viewAdapter.__element.type.toLowerCase() : "")]||valueFunctions.default;
            };
        }
    );
}();