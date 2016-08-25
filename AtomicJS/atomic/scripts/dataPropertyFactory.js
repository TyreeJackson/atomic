!function()
{
    "use strict";
    var defineDataProperties;
    function buildFunction(isolatedFunctionFactory, each)
    {
        var functionFactory = new isolatedFunctionFactory();
        var createProperty  =
        functionFactory.create
        (function createProperty(owner, getter, setter, onchange, binder)
        {
            function property(value, forceSet)
            {
                if (value !== undefined || forceSet)
                {
                    setter.call(owner, value);
                    if (Object.keys(property.__onchange).length===0)    property.__inputListener();
                }
                else                                    return getter.call(owner);
            };
            Object.defineProperties(property,
            {
                __owner:                {value: owner},
                __getter:               {value: function(){return getter.call(owner);}},
                __setter:               {value: function(value){setter.call(owner, value);}},
                __notifyingObserver:    {value: undefined, writable: true},
                __onchange:             {value: {}},
                __inputListener:        {value: function(){property.___inputListener();}}
            });
            if (typeof onchange === "string") debugger;
            property.onchange = onchange;
            if (binder) binder.register(property);
            return property;
        });
        function bindData()
        {
            if (this.__data === undefined || this.__data == null)   return;
            Object.defineProperty(this,"__bounded", {value: true, configurable: true});
            if (this.__bind !== undefined)
            {
                Object.defineProperty(this, "__bindListener", 
                {
                    configurable:   true, 
                    value:          (function()
                    {
                        var value = this.__getDataValue();
                        if (!this.__notifyingObserver) this.__setter(value);
                        notifyOnDataUpdate.call(this, this.data); 
                    }).bind(this)
                });
                each(this.__onchange, (function(onchange){onchange.listen(this.__inputListener);}).bind(this));
                this.data.listen(this.__bindListener);
                notifyOnbind.call(this, this.data);
                return this;
            }
            else if (this.__ondataupdate)
            {
                Object.defineProperty(this, "__bindListener", {configurable: true, value: function(){ notifyOnDataUpdate.call(this, this.data); }});
                this.data.listen(this.__bindListener);
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
                if (notify = this.data !== undefined)   this.data.ignore(this.__bindListener);
                this.__bindListener.ignore = true;
                Object.defineProperty(this, "__bindListener", {configurable: true, value: undefined});
            }
            each(this.__onchange, (function(onchange){onchange.ignore(this.__inputListener);}).bind(this));
            if (notify)                                 notifyOnunbind.call(this);
        }
        function notifyOnbind(data)         { if (this.__onbind) this.__onbind(data); }
        function notifyOnDataUpdate(data)   { if (this.__ondataupdate) this.__ondataupdate(data); }
        function notifyOnunbind(data)       { if (this.__onunbind) this.__onunbind(data); }
        function rebind(callback)
        {
            unbindData.call(this);
            callback.call(this);
            bindData.call(this);
        }
        Object.defineProperties(functionFactory.root.prototype,
        {
            ___inputListener:
            {
                value:  function()
                {
                    if (this.__bounded===false) return;
                    this.__notifyingObserver    = true;
                    this.__setDataValue();
                    this.__notifyingObserver    = false;
                }
            },
            __getDataValue:
            {
                value:  function()
                {
                    if      (typeof this.__bind === "function")                     return this.__bind.call(this.__owner, this.data);
                    else if (typeof this.__bind === "string")                       return this.data(this.__bind);
                    else if (this.__bind && typeof this.__bind.get === "function")  {debugger;return this.__bind.get.call(this.owner, this.data);}
                    debugger;
                    return this.data();
                }
            },
            __setDataValue:
            {
                value:  function()
                {
                    if (typeof this.__bind === "string")                                this.data(this.__bind, this.__getter());
                    else if (this.__bind && typeof this.__bind.set === "function")      this.__bind.set.call(this.owner, this.data, this.__getter());
                    else throw new Error("Unable to set back two way bound value to model.");
                }
            },
            onchange:
            {
                get:    function(){return this.__onchange;},
                set:    function(value) {rebind.call(this,function()
                {
                    each(this.__onchange,   (function(event, name){Object.defineProperty(this.__onchange,name,{writable: true});delete this.__onchange[name];}).bind(this));
                    each(value,             (function(event, name){Object.defineProperty(this.__onchange,name,{value: event, configurable: true, enumerable: true});}).bind(this));
                });}
            }
        });
        each(["data","bind"],function(name)
        {
            Object.defineProperty(functionFactory.root.prototype, name,
            {
                get:    function(){return this["__"+name];},
                set:    function(value)
                {
                    rebind.call(this, function()
                    {
                        Object.defineProperty(this, "__"+name, {value: value, configurable: true});
                    });
                    if(typeof this[name+"updated"] === "function")  this[name+"updated"](value);
                }
            });
        });
        each(["onbind","ondataupdate","onunbind"],function(name)
        {
            Object.defineProperty(functionFactory.root.prototype, name,
            {
                get:    function(){return this["__"+name];},
                set:    function(value){Object.defineProperty(this, "__"+name, {value: value, configurable: true});}
            });
        });
        function defineDataProperties(target, binder, properties)
        {
            for(var propertyName in properties)
            {
                var property = properties[propertyName];
                Object.defineProperty(target, propertyName, {value: createProperty(target, property.get, property.set, property.onchange, binder), configurable: true})
            }
        }
        return defineDataProperties;
    }
    root.define("atomic.defineDataProperties", function(isolatedFunctionFactory, each)
    {
        if (defineDataProperties === undefined) defineDataProperties    = buildFunction(isolatedFunctionFactory, each);
        return defineDataProperties;
    });
}();