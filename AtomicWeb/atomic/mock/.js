(function(global)
{with(namespace("atomic")("mocking"))
{
    const debugging   = false;
    function debugLog(message)
    {
        if (debugging === true) console.info(message);
    }
    function AtomicProxy(proxiedName, getCallback, setCallback, invocationCallback)
    {
        function proxyFunction()
        {
            debugLog(proxiedName + " was invoked as a function with args: " + JSON.stringify(arguments));
            return invocationCallback(proxyFunction, proxiedName, arguments);
        }
//        proxyFunction.defineFunction("toString", function(){return "AtomicProxy{" + proxiedName + "}.proxyFunction";});
        var proxy =
        new Proxy
        (
            proxyFunction, 
            {
                get:
                function(target, name)
                {
                    if (name != "toString" && name != "valueOf") debugLog(proxiedName + "." + name + " was accessed.");
                    return getCallback(target, proxiedName, name) || target[name];
                },
                set:
                function(target, name, value)
                {
                    debugLog("Call to set " + proxiedName + "." + name + " occurred with value " + value);
                    setCallback(target, proxiedName, name, value);
                }
            }
        );
        return proxy;
    }
    define
    ({
        class:      function Mock(){},
        instance:   function(base, privileged)
        {return{
            constructor:
            function()
            {
                privileged.proxy    = new AtomicProxy("mock", this.getCallback, this.setCallback, this.invocationCallback);
            },
            protected:
            {
                proxy:                  {field: null},
                getActions:             {field: {}},
                setActions:             {field: {}},
                invocationActions:      {field: {}},
                isSettingUp:            {field: false},
                lastActionToSetup:      {field: null},
                lastActionToSetupName:  {field: ""},
                isVerifying:            {field: false},
                lastActionToVerify:     {field: null},
                lastActionToVerifyName: {field: ""}
            },
            public:
            {
                getCallback:
                function(target, proxiedName, name)
                {
                    var fullName    = proxiedName + "." + name;
                    if (name != "toString" && name != "valueOf") debugLog("get: " + fullName);
                    if (!(name in target))
                    {
                        target[name]    = new AtomicProxy(fullName, this.getCallback, this.setCallback, this.invocationCallback);
                    }

                    if (privileged.isSettingUp)
                    {
                        if (name != "toString" && name != "valueOf")
                        {
                            privileged.lastActionToSetup        = privileged.getActions[fullName]   = privileged.getActions[fullName] || {callCount: 0};
                            privileged.lastActionToSetupName    = "getActions[" + fullName + "]";
                        }
                        return target[name];
                    }
                    else if (privileged.isVerifying)
                    {
                        if (name != "toString" && name != "valueOf")
                        {
                            privileged.lastActionToVerify       = privileged.getActions[fullName]   = privileged.getActions[fullName] || {callCount: 0};
                            privileged.lastActionToVerifyName   = "getActions[" + fullName + "]";
                        }
                        return target[name];
                    }
                    else
                    {
                        privileged.getActions[fullName].callCount++;
                        return exists(privileged.getActions[fullName].invoke)
                        ?   privileged.getActions[fullName].invoke()
                        :   target[fullName]
                    }
                },
                setCallback:
                function(target, proxiedName, name, value)
                {
                    var fullName    = proxiedName + "." + name;
                    debugLog("set: " + fullName + " = " + value);
                    if (privileged.isSettingUp)
                    {
                        if (name != "toString" && name != "valueOf")
                        {
                            privileged.lastActionToSetup        = privileged.setActions[fullName]   = privileged.setActions[fullName] || {callCount: 0};
                            privileged.lastActionToSetupName    = "setActions[" + fullName + "]";
                        }
                    }
                    else if (privileged.isVerifying)
                    {
                        if (name != "toString" && name != "valueOf")
                        {
                            privileged.lastActionToVerify       = privileged.setActions[fullName]   = privileged.setActions[fullName] || {callCount: 0};
                            privileged.lastActionToVerifyName   = "setActions[" + fullName + "]";
                        }
                    }
                    else
                    {
                        privileged.setActions[fullName].callCount++;
                        if (exists(privileged.setActions[fullName].invoke)) privileged.setActions[fullName].invoke();
                    }
                },
                invocationCallback:
                function(target, name, args)
                {
                    var fullName    = name + "(" + JSON.stringify(args) + ")";
                    debugLog("invoke: " + fullName);
                    if (!(fullName in target))  target[fullName]    = new AtomicProxy(fullName, this.getCallback, this.setCallback, this.invocationCallback);
                    if (privileged.isSettingUp)
                    {
                        if (name != "toString" && name != "valueOf")
                        {
                            privileged.lastActionToSetup        = privileged.invocationActions[fullName]   = privileged.invocationActions[fullName] || {callCount: 0};
                            privileged.lastActionToSetupName    = "invocationActions[" + fullName + "]";
                        }
                        return target[fullName];
                    }
                    else if (privileged.isVerifying)
                    {
                        if (name != "toString" && name != "valueOf")
                        {
                            privileged.lastActionToVerify       = privileged.invocationActions[fullName]   = privileged.invocationActions[fullName] || {callCount: 0};
                            privileged.lastActionToVerifyName   = "invocationActions[" + fullName + "]";
                        }
                        return target[fullName];
                    }
                    else
                    {
                        privileged.invocationActions[fullName].callCount++
                        return privileged.invocationActions[fullName].invoke();
                    }
                },
                Setup:
                function(setup)
                {
                    privileged.isSettingUp  = true;
                    setup(privileged.proxy);
                    privileged.isSettingUp  = false;
                    return this;
                },
                Returns:
                function(value)
                {
                    privileged.lastActionToSetup.invoke = function(){return value;};
                    return this;
                },
                Throws:
                function(errorMessage)
                {
                    privileged.lastActionToSetup.invoke = function(){throw new Error(errorMessage);};
                    return this;
                },
                Object: {property: {get: function(){return privileged.proxy;}}},
                Verify:
                function(callPath, verifier)
                {
                    privileged.isVerifying  = true;
                    callPath(privileged.proxy);
                    privileged.isVerifying  = false;
                    return verifier(privileged.lastActionToVerify);
                }
            }
        }}
    });
}})(this);
