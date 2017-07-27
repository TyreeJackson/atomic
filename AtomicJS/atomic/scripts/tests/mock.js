!function()
{root.define("atomic.testUtilities.mock",
function mockModule(debugLogger)
{
    const debugging = true;
    const isAnyKey  = "__mock.isAny__";
    function isAnyObject(){}
    isAnyObject.prototype.toString = function(){return isAnyKey;};
    var isAny       = new isAnyObject();
    function exists(item) {return item !== undefined && item !== null;}
    function debugLog(message) { if (debugging === true) debugLogger(message); }
    var times   =
    {
        never:          function()              {return function(stat){return {result: stat.callCount==0,                message: "Invocation of the " + stat.method +" method was expected exactly " + 0 + " times but was executed " + stat.callCount + " times."};};},
        once:           function()              {return function(stat){return {result: stat.callCount==1,                message: "Invocation of the " + stat.method +" method was expected exactly " + 1 + " times but was executed " + stat.callCount + " times."};};},
        atLeast:        function(expectedCount) {return function(stat){return {result: stat.callCount>=expectedCount,    message: "Invocation of the " + stat.method +" method was expected at least " + expectedCount + " times but was executed " + stat.callCount + " times."};};},
        atLeastOnce:    function()              {return function(stat){return {result: stat.callCount>=1,                message: "Invocation of the " + stat.method +" method was expected at least " + 1 + " times but was executed " + stat.callCount + " times."};};},
        exactly:        function(expectedCount) {return function(stat){return {result: stat.callCount==expectedCount,    message: "Invocation of the " + stat.method +" method was expected exactly " + expectedCount + " times but was executed " + stat.callCount + " times."};};}
    };
    function proxy(proxiedName, mock)
    {
        function proxyFunction()
        {
            debugLog(proxiedName + " was invoked as a function with args: " + JSON.stringify(arguments));
            return mock.invocationCallback(proxyFunction, proxiedName, arguments);
        }
//        proxyFunction.defineFunction("toString", function(){return "proxy{" + proxiedName + "}.proxyFunction";});
        var proxy =
        new Proxy
        (
            proxyFunction, 
            {
                get:
                function(target, name)
                {if (typeof name === "symbol") debugger;
                    if (name != "toString" && name != "valueOf" && name != "toJSON") debugLog(proxiedName + "." + name + " was accessed.");
                    if (name == "toJSON")   return function(){return "";};
                    return mock.getCallback(target, proxiedName, name);
                },
                set:
                function(target, name, value)
                {
                    debugLog("Call to set " + proxiedName + "." + name + " occurred with value " + value);
                    mock.setCallback(target, proxiedName, name, value);
                }
            }
        );
        return proxy;
    }
    function matchCallArguments(callArguments, argumentsToMatch)
    {
        if (callArguments.length != argumentsToMatch.length)    return false;
        for(var argumentCounter=0;argumentCounter<callArguments.length;argumentCounter++)
        if (callArguments[argumentCounter] !== argumentsToMatch[argumentCounter]) return false;
        return true;
    }
    function matchCallCount()
    {
        var callCounts  = 0;
        for(var callCounter=0;callCounter<this.calls.length;callCounter++)
        if (matchCallArguments(this.calls[callCounter], this.arguments))  callCounts++
        return callCounts;
    }
    function getInvocationAction(invocationActions, fullName)
    {
        if (!(fullName in invocationActions))
        {
            var invocationAction;
            invocationAction                = {calls: [], method: fullName};
            Object.defineProperty(invocationAction, "callCount", {get: function(){return matchCallCount.call(this);}});
            invocationActions[fullName]     = invocationAction;
        }
        return invocationActions[fullName];
    }
    function mock(mockName)
    {
        this.__privileged   = 
        {
            proxy:                  new proxy(mockName||"mock", this),
            getActions:             {},
            setActions:             {},
            invocationActions:      {},
            isSettingUp:            false,
            lastActionToSetup:      null,
            lastActionToSetupName:  "",
            isVerifying:            false,
            lastActionToVerify:     null,
            lastActionToVerifyName: ""
        };
    }
    mock.prototype.getCallback          =
    function(target, proxiedName, name)
    {
        var fullName                                = proxiedName + "." + name;
        if (name != "toString" && name != "valueOf") debugLog("get: " + fullName);
        if (!(name in target))
        {
            target[name]                            = new proxy(fullName, this);
        }

        if (this.__privileged.isSettingUp)
        {
            if (name != "toString" && name != "valueOf")
            {
                this.__privileged.lastActionToSetup        = this.__privileged.getActions[fullName]   = this.__privileged.getActions[fullName] || {method: fullName, callCount: 0};
                this.__privileged.lastActionToSetupName    = "getActions[" + fullName + "]";
            }
            return target[name];
        }
        else if (this.__privileged.isVerifying)
        {
            if (name != "toString" && name != "valueOf")
            {
                this.__privileged.lastActionToVerify       = this.__privileged.getActions[fullName]   = this.__privileged.getActions[fullName] || {method: fullName, callCount: 0};
                this.__privileged.lastActionToVerifyName   = "getActions[" + fullName + "]";
            }
            return target[name];
        }
        else
        {
            var action  = this.__privileged.getActions[fullName];
            var isAny   = false;
            if (!action)
            {
                action  = this.__privileged.getActions[proxiedName+"."+isAnyKey] || (this.__privileged.getActions[fullName]   = {callCount: 0});
                isAny   = true;
            }

            action.callCount++;
            return exists(action.invoke)
            ?   isAny?action.invoke(name):action.invoke()
            :   target[name]
        }
    };
    mock.prototype.setCallback          =
    function(target, proxiedName, name, value)
    {
        var fullName                                = proxiedName + "." + name;
        debugLog("set: " + fullName + " = " + value);
        if (!(name in target))
        {
            target[name]                            = new proxy(fullName, this);
        }

        if (this.__privileged.isSettingUp)
        {
            if (name != "toString" && name != "valueOf")
            {
                this.__privileged.lastActionToSetup        = this.__privileged.setActions[fullName]   = this.__privileged.setActions[fullName] || {method: fullName, callCount: 0};
                this.__privileged.lastActionToSetupName    = "setActions[" + fullName + "]";
            }
        }
        else if (this.__privileged.isVerifying)
        {
            if (name != "toString" && name != "valueOf")
            {
                this.__privileged.lastActionToVerify       = this.__privileged.setActions[fullName]   = this.__privileged.setActions[fullName] || {method: fullName, callCount: 0};
                this.__privileged.lastActionToVerifyName   = "setActions[" + fullName + "]";
            }
        }
        else
        {
            var action  = this.__privileged.setActions[fullName];
            if (!action)    action  = this.__privileged.setActions[fullName]   = {callCount: 0};
            action.callCount++;
            if (exists(action.invoke)) action.invoke();
        }
    };
    mock.prototype.invocationCallback   =
    function(target, name, args)
    {
        var fullName    = name;
        debugLog("invoke: " + fullName);
        if (!(fullName in target))  target[fullName]    = new proxy(fullName, this);
        if (this.__privileged.isSettingUp)
        {
            if (name != "toString" && name != "valueOf")
            {
                this.__privileged.lastActionToSetup        = getInvocationAction(this.__privileged.invocationActions, fullName);
                this.__privileged.lastActionToSetupName    = "invocationActions[" + fullName + "]";
            }
            return target[fullName];
        }
        else if (this.__privileged.isVerifying)
        {
            if (name != "toString" && name != "valueOf")
            {
                this.__privileged.lastActionToVerify           = getInvocationAction(this.__privileged.invocationActions, fullName);
                this.__privileged.lastActionToVerifyName       = "invocationActions[" + fullName + "]";
                this.__privileged.lastActionToVerify.arguments = args;
            }
            return target[fullName];
        }
        else
        {
            var invocationAction    = getInvocationAction(this.__privileged.invocationActions, fullName);
            invocationAction.calls.push(args);
            return typeof invocationAction.invoke === "function" ? invocationAction.invoke.apply(this, args) : undefined;
        }
    };
    mock.prototype.setup                =
    function(setup)
    {
        this.__privileged.isSettingUp  = true;
        setup(this.__privileged.proxy);
        this.__privileged.isSettingUp  = false;
        return this;
    };
    mock.prototype.returns              =
    function(value)
    {
        this.__privileged.lastActionToSetup.invoke = function(){return value;};
        return this;
    };
    mock.prototype.callback             =
    function(callback)
    {
        this.__privileged.lastActionToSetup.invoke = function(){return callback.apply(this, arguments);};
        return this;
    };
    mock.prototype.throws               =
    function(errorMessage)
    {
        this.__privileged.lastActionToSetup.invoke = function(){throw new Error(errorMessage);};
        return this;
    };
    mock.prototype.verify               =
    function(callPath, verifier)
    {
        this.__privileged.isVerifying  = true;
        callPath(this.__privileged.proxy);
        this.__privileged.isVerifying  = false;
        var verification    = verifier(this.__privileged.lastActionToVerify);
        if (!verification.result)   throw new Error(verification.message);
    }
    Object.defineProperty
    (
        mock.prototype,
        "object",
        {get: function(){return this.__privileged.proxy;}}
    );
    Object.defineProperty
    (
        mock,
        "isAny",
        {get: function(){return isAny;}}
    );
    Object.defineProperty
    (
        mock,
        "times",
        {get: function(){return times;}}
    );
    return mock;
});}();