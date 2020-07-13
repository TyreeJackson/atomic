!function()
{"use strict";
    var defineDataProperties;
    var bindCounter             = 0;
    function buildFunction(isolatedFunctionFactory, reflect)
    {
        var functionFactory = new isolatedFunctionFactory();
        var dataProperty    =
        functionFactory.create
        (function dataProperty(owner, getter, setter, onchange, binder, delay, name)
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
                __inputListener:        {value: function(event){property.___inputListener(); if (event !== undefined && event !== null && typeof event.stopPropagation === "function") event.stopPropagation();}, configurable: true},
                name:                   {value: name}
            });
            if (typeof onchange === "string") debugger;
            property.listen({onchange: onchange});
            if (binder) binder.register(property);
            return property;
        });
        function bindData()
        {
            var that    = this;
            if (this.__data === undefined || this.__data == null || this.isDestroyed)   return;
            Object.defineProperty(this,"__bounded", {value: true, configurable: true});
            if (this.__bind !== undefined)
            {
                Object.defineProperty(this, "__bindListener", 
                {
                    configurable:   true, 
                    value:          function __bindListener(val, ignore)
                    {
                        var value           = that.__getDataValue();
                        var currentValue    = that.__getter();
                        if (value === currentValue)  return;
                        if (!that.__notifyingObserver) that.__setter(value);
                        ignore(function ignoreCallback(){notifyOnDataUpdate.call(that, that.data);}); 
                    }
                });
                var onchangeKeys    = Object.keys(this.__onchange);
                for(var counter=0, onchangeKey;(onchangeKey=onchangeKeys[counter]) !== undefined; counter++)    this.__onchange[onchangeKey].listen(this.__inputListener, true);
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
            var onchangeKeys    = Object.keys(this.__onchange);
            for(var counter=0, onchangeKey;(onchangeKey=onchangeKeys[counter]) !== undefined; counter++)    this.__onchange[onchangeKey].ignore(this.__inputListener);
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
            destroy:            {value: function destroy()
            {
                unbindData.call(this);
                reflect.deleteProperties(this.__onchange, Object.keys(this.__onchange));
                reflect.deleteProperties(this,
                [
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
                ]);
                Object.defineProperty(this, "isDestroyed", {value: true});
            }},
            __debugBindPath:    {get: function()
            {
                var bindPath    = this.__bindPath||"";
                return  this.__bind !== undefined
                        ?   typeof this.__bind === "string"
                            ?   (bindPath.length>0?bindPath+".":"")+this.__bind
                            :   typeof this.__bind === "function"
                                ?   "function(data(`" + bindPath + "`))"
                                :   this.__bind && typeof this.__bind.get === "function"
                                    ?   "getter(data(`" + bindPath + "`))"
                                    :   bindPath
                        :   undefined;
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
                    var optionKeys = ["data","bindPath","root","onupdate"];
                    for(var counter=0,optionKey;(optionKey=optionKeys[counter]) !== undefined; counter++)
                    {
                        if(options[optionKey] !== undefined)    Object.defineProperty(this, "__"+optionKey, {value: options[optionKey], configurable: true});
                    }
                    if (options.bindPath !== undefined) this.__binder.__updateDebugInfo();
                    if(options.bind !== undefined)
                    {
                        Object.defineProperty(this, "__bind", {value: options.bind, configurable: true});
                    }
                    if(options.onchange !== undefined)
                    {
                        var onchangeKeys    = Object.keys(this.__onchange);
                        reflect.deleteProperties(this.__onchange, onchangeKeys);

                        onchangeKeys       = Object.keys(options.onchange);
                        for(var counter2=0, onchangeKey;(onchangeKey=onchangeKeys[counter2]) !== undefined; counter2++)
                        {
                            var event   = options.onchange[onchangeKey];
                            Object.defineProperty(this.__onchange,onchangeKey,{value: event, configurable: true, enumerable: true});
                        }
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
        function definePrototypeMember(name)
        {
            Object.defineProperty(functionFactory.root.prototype, name,
            {
                get:    function(){return this["__"+name];},
                set:    function(value){throw new Error("obsolete");}
            });
        }
        definePrototypeMember("data");
        definePrototypeMember("bind");
        definePrototypeMember("root");

        function definePrototypeMember2(name)
        {
            Object.defineProperty(functionFactory.root.prototype, name,
            {
                get:    function(){return this["__"+name];},
                set:    function(value){Object.defineProperty(this, "__"+name, {value: value, configurable: true});}
            });
        }
        definePrototypeMember2("onbind");
        definePrototypeMember2("onunbind");
        definePrototypeMember2("delay");

        function defineDataProperty(target, binder, propertyName, property)
        {
            if (target.hasOwnProperty(propertyName))
            {
                binder.unregister(target[propertyName]);
                target[propertyName].destroy();
                Object.defineProperty(target, propertyName, {value: null, configurable: true, writable: true}); 
                delete target[propertyName];
            }
            Object.defineProperty(target, propertyName, {value: new dataProperty(property.owner||target, property.get, property.set, property.onchange, binder, property.delay, propertyName), configurable: true})

            var memberNames = ["onbind","onupdate","onunbind","delay"];
            for(var counter=0,memberName;(memberName=memberNames[counter]) !== undefined; counter++)    if (property[memberName])   target[propertyName][memberName] = property[memberName];
        }
        function defineDataProperties(target, binder, properties, singleProperty)
        {
            if (typeof properties === "string") defineDataProperty(target, binder, properties, singleProperty);
            else
            {
                var propertyKeys    = Object.keys(properties);
                for(var counter=0,propertyKey;(propertyKey=propertyKeys[counter]) !== undefined; counter++) defineDataProperty(target, binder, propertyKey, properties[propertyKey]);
            }
        }
        return defineDataProperties;
    }
    root.define("atomic.defineDataProperties", function(isolatedFunctionFactory, reflect)
    {
        if (defineDataProperties === undefined) defineDataProperties    = buildFunction(isolatedFunctionFactory, reflect);
        return defineDataProperties;
    });
}();