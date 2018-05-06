!function()
{"use strict";
    var defineDataProperties;
    var bindCounter             = 0;
    function buildFunction(isolatedFunctionFactory, each)
    {
        var functionFactory = new isolatedFunctionFactory();
        var dataProperty    =
        functionFactory.create
        (function dataProperty(owner, getter, setter, onchange, binder, delay)
        {if (binder === undefined)  debugger;
            var property    = this;
            Object.defineProperties(this,
            {
                ___invoke:              {value: function(value, forceSet)
                {
                    if (value !== undefined || forceSet)
                    {
                        if (typeof setter === "function")   setter.call(owner, value);
                        if (Object.keys(this.__onchange).length===0)    property.__inputListener();
                    }
                    else                                    return getter.call(owner);
                }, configurable: true},
                __owner:                {value: owner, configurable: true},
                __binder:               {value: binder, configurable: true},
                __delay:                {value: delay, configurable: true},
                __getter:               {value: function(){if(getter === undefined) debugger; return getter.call(owner);}, configurable: true},
                __setter:               {value: function(value){if (typeof setter === "function") setter.call(owner, value);}, configurable: true},
                __notifyingObserver:    {value: undefined, writable: true, configurable: true},
                __onchange:             {value: {}, configurable: true},
                __inputListener:        {value: function(event){property.___inputListener(); if (event !== undefined && event !== null && typeof event.stopPropagation === "function") event.stopPropagation();}, configurable: true}
            });
            if (typeof onchange === "string") debugger;
            property.listen({onchange: onchange});
            if (binder) binder.register(property);
            return property;
        });
        function bindData()
        {
            if (this.__data === undefined || this.__data == null || this.isDestroyed)   return;
            Object.defineProperty(this,"__bounded", {value: true, configurable: true});
            if (this.__bind !== undefined)
            {
                Object.defineProperty(this, "__bindListener", 
                {
                    configurable:   true, 
                    value:          (function(val, ignore)
                    {
                        var value           = this.__getDataValue();
                        var currentValue    = this.__getter();
                        if (value === currentValue)  return;
                        if (!this.__notifyingObserver) this.__setter(value);
                        ignore((function(){notifyOnDataUpdate.call(this, this.data);}).bind(this)); 
                    }).bind(this)
                });
                each(this.__onchange, (function(onchange){onchange.listen(this.__inputListener, true);}).bind(this));
                this.data.listen(this.__bindListener, this.__root);
                notifyOnbind.call(this, this.data);
                return this;
            }
            else if (this.__onupdate)
            {
                Object.defineProperty(this, "__bindListener", {configurable: true, value: (function(){ this.__getDataValue(); setTimeout((function(){notifyOnDataUpdate.call(this, this.data);}).bind(this),0); }).bind(this)});
                this.data.listen(this.__bindListener, this.__root);
                notifyOnbind.call(this, this.data);
            }
            return this;
        }
        function unbindData()
        {
            Object.defineProperty(this,"__bounded", {value: false, configurable: true});
            var notify = false;
            if (this.__bindListener !== undefined)
            {
                if (notify = (this.data !== undefined)) this.data.ignore(this.__bindListener);
                this.__bindListener.ignore  = true;
                Object.defineProperty(this, "__bindListener", {configurable: true, value: undefined});
            }
            each(this.__onchange, (function(onchange){onchange.ignore(this.__inputListener);}).bind(this));
            if (notify)                                 notifyOnunbind.call(this);
        }
        function notifyOnbind(data)         { if (this.__onbind) this.__onbind.call(this.__owner, data); }
        function notifyOnDataUpdate(data)   { if (this.__onupdate) this.__onupdate.call(this.__owner, data); }
        function notifyOnunbind(data)       { if (this.__onunbind) this.__onunbind.call(this.__owner, data); }
        
        function rebind(callback)
        {
            unbindData.call(this);
            callback.call(this);
            bindData.call(this);
        }
        Object.defineProperties(functionFactory.root.prototype,
        {
            destroy:            {value: function()
            {
                unbindData.call(this);
                each
                ([
                    "___invoke",
                    "__owner",
                    "__binder",
                    "__delay",
                    "__getter",
                    "__setter",
                    "__notifyingObserver",
                    "__onchange",
                    "__inputListener",
                    "__data",
                    "__bind",
                    "__root",
                    "__onbind",
                    "__onupdate",
                    "__onunbind"
                ],
                (function(name)
                {
                    Object.defineProperty(this, name, {value: null, configurable: true});
                    delete this[name];
                }).bind(this));
                Object.defineProperty(this, "isDestroyed", {value: true});
            }},
            ___inputListener:   {value: function()
            {
                if (this.__delayId !== undefined)
                {
                    clearTimeout(this.__delayId);
                    delete this.__delayId;
                }
                function notifyObserver()
                {
                    if (this.__bounded===false) return;
                    this.__notifyingObserver    = true;
                    this.__setDataValue();
                    this.__notifyingObserver    = false;
                }
                if (this.__delay === undefined) notifyObserver.call(this);
                else                            this.__delayId  = setTimeout(notifyObserver.bind(this), this.__delay);
            }},
            __getDataValue:
            {
                value:  function()
                {
                    var bindPath    = this.__bindPath||"";
                    if      (typeof this.__bind === "function")                     return this.__bind.call(this.__owner, this.data.observe(bindPath));
                    else if (typeof this.__bind === "string")                       return this.data((bindPath.length>0?bindPath+".":"")+this.__bind);
                    else if (this.__bind && typeof this.__bind.get === "function")  return this.__bind.get.call(this.__owner, this.data.observe(bindPath));
                    return this.data(bindPath);
                }
            },
            __setDataValue:
            {
                value:  function()
                {
                    var bindPath    = this.__bindPath||"";
                    if (this.__getter === undefined || this.__bind === undefined)   return;

                    if      (typeof this.__bind === "string")                       this.data((bindPath.length>0?bindPath+".":"")+this.__bind, this.__getter());
                    else if (this.__bind && typeof this.__bind.set === "function")  this.__bind.set.call(this.__owner, this.data.observe(bindPath), this.__getter());
                    else                                                            {debugger; throw new Error("Unable to set back two way bound value to model.");}
                }
            },
            isDataProperty: {value: true, configurable: false, writable: false},
            listen:         {value: function(options)
            {
                rebind.call(this, function()
                {
                    each(["data","bindPath","root","onupdate"],(function(name){ if(options[name] !== undefined) Object.defineProperty(this, "__"+name, {value: options[name], configurable: true}); }).bind(this));
                    if(options.bind !== undefined)
                    {
                        Object.defineProperty(this, "__bind", {value: options.bind, configurable: true});
                    }
                    if(options.onchange !== undefined)
                    {
                        each(this.__onchange,   (function(event, name){Object.defineProperty(this.__onchange,name,{writable: true});delete this.__onchange[name];}).bind(this));
                        each(options.onchange,  (function(event, name){Object.defineProperty(this.__onchange,name,{value: event, configurable: true, enumerable: true});}).bind(this));
                    }
                });
            }},
            onchange:
            {
                get:    function(){return this.__onchange;},
                set:    function(value){throw new Error("obsolete");}
            },
            update:         {value: function(){this.___inputListener();}}
        });
        each(["data","bind","root"],function(name)
        {
            Object.defineProperty(functionFactory.root.prototype, name,
            {
                get:    function(){return this["__"+name];},
                set:    function(value){throw new Error("obsolete");}
            });
        });
        each(["onbind","onunbind","delay"],function(name)
        {
            Object.defineProperty(functionFactory.root.prototype, name,
            {
                get:    function(){return this["__"+name];},
                set:    function(value){Object.defineProperty(this, "__"+name, {value: value, configurable: true});}
            });
        });
        function defineDataProperty(target, binder, propertyName, property)
        {
            if (target.hasOwnProperty(propertyName)) target[propertyName].destroy();
            Object.defineProperty(target, propertyName, {value: new dataProperty(property.owner||target, property.get, property.set, property.onchange, binder, property.delay), configurable: true})
            each(["onbind","onupdate","onunbind","delay"],function(name){if (property[name])  target[propertyName][name] = property[name];});
        }
        function defineDataProperties(target, binder, properties, singleProperty)
        {
            if (typeof properties === "string") defineDataProperty(target, binder, properties, singleProperty);
            else                                each(properties, function(property, propertyName){defineDataProperty(target, binder, propertyName, property);});
        }
        return defineDataProperties;
    }
    root.define("atomic.defineDataProperties", function(isolatedFunctionFactory, each)
    {
        if (defineDataProperties === undefined) defineDataProperties    = buildFunction(isolatedFunctionFactory, each);
        return defineDataProperties;
    });
}();