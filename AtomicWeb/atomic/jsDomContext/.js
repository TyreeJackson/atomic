(function(global)
{with(namespace("atomic"))
{
    function AtomicProxy(proxiedName)
    {
        function proxyFunction()
        {
            console.info(proxiedName + " was invoked as a function with args: " + JSON.stringify(arguments));
            return new AtomicProxy(proxiedName + "(" + JSON.stringify(arguments) + ")");
        }
        proxyFunction.defineFunction("toString", function(){return "AtomicProxy{" + proxiedName + "}";});
        var proxy =
        new Proxy
        (
            proxyFunction, 
            {
                get:
                function(target, name)
                {
                    if (!(name in target))  target[name]    = new AtomicProxy(proxiedName + "." + name);
                    if (name != "toString" && name != "valueOf") console.info(proxiedName + "." + name + " was accessed and " + target[name] + " was returned.");
                    return  target[name];
                },
                set:
                function(target, name, value)
                {
                    console.info("Call to set " + proxiedName + "." + name + " occurred with value " + value);
                    target[name]    = value;
                }
            }
        );
        return proxy;
    }
    define
    ({
        class:      function JSDomContext(){},
        extends:    BaseContext,
        instance:   function(base, privileged)
        {return{
            constructor:
            function()
            {
                base(new AtomicProxy("document"));
            },
            public:
            {
            }
        }}
    });
}})(this);