!function(){"use strict";root.define("atomic.dataBinder", function dataBinder(each, removeItemFromArray, defineDataProperties)
{
    function notifyProperties()
    {
        each(this.__properties,(function(property)
        {
            property.listen({bindPath: this.bindPath||"", data: this.data===undefined?null:this.data});
        }).bind(this));
    }
    function dataBinder(target, data)
    {
        Object.defineProperties(this,
        {
            "__properties": {value: [], configurable: true},
            "__forceRoot":  {value: false, configurable: true},
            "__target":     {value: target, configurable: true}
        });
        this.__makeRoot();
        if (data) this.data = data;
    };
    Object.defineProperties(dataBinder.prototype,
    {
        __makeRoot:             {value: function()
        {
            var parent  = this.__parentBinder;
            Object.defineProperty(this,"__parentBinder", {value: null, configurable: true});
            if(parent)   parent.unregister(this);
        }},
        __getDebugInfo:         {value: function()
        {
            var debugInfo   = {};
            each(this.__properties,(function(property)
            {
                var debugBindPath   = property.__debugBindPath;
                if (debugBindPath !== undefined)    debugInfo[property.name]    = debugBindPath;
            }).bind(this));
            return debugInfo;
        }},
        __updateDebugInfo:      {value: function(){if (this.__target !== undefined) this.__target.__updateDebugInfo();}},
        bindPath:
        {
            get:    function(){return this.__bindPath;},
            set:    function(value){Object.defineProperty(this,"__bindPath", {value: value, configurable: true}); notifyProperties.call(this);}
        },
        data:
        {
            get:    function(){return this.__data;},
            set:    function(value)
            {
                if (value !== undefined && value !== null && value.isBinder && !this.__forceRoot)
                {
                    Object.defineProperty(this,"__parentBinder", {value: value, configurable: true});
                    value.register(this);
                    return;
                }

                if (this.__parentBinder !== null && value !== this.__parentBinder.data)
                {
                    Object.defineProperty(this,"__parentBinder", {value: null, configurable: true});
                    return;
                }

                Object.defineProperty(this, "__data", {value: value, configurable: true});
                notifyProperties.call(this);
            }
        },
        defineDataProperties:   {value: function (target, properties, singleProperty){defineDataProperties(target, this, properties, singleProperty);}},
        destroy:                {value: function()
        {
            each(this.__properties,(function(property){property.destroy();}).bind(this));
            each
            ([
                "__properties",
                "__forceRoot",
                "__target",
                "__data"
            ],
            (function(name)
            {
                Object.defineProperty(this, name, {value: null, configurable: true});
                delete this[name];
            }).bind(this));
            Object.defineProperty(this, "isDestroyed", {value: true});
        }},
        isBinder:               {value: true},
        isRoot:
        {
            get: function(){return this.__forceRoot || (this.__parentBinder==null&&this.__data!=null);}, 
            set: function(value)
            {
                if (value===true)   this.__makeRoot();
                Object.defineProperty(this, "__forceRoot", {value: value, configurable: true});
            }
        },
        register:               {value: function(property){if (this.__properties.indexOf(property)==-1) this.__properties.push(property); property.listen({data: this.data, bindPath: this.bindPath});}},
        unregister:             {value: function(property){removeItemFromArray(this.__properties, property);}}
    });
    return dataBinder;
});}()