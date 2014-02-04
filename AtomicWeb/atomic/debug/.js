(function(global)
{with(namespace("debug"))
{
    define
    (
        function assert(test, message)
        {
            if (exists(global.console) && exists(global.console.assert))    global.console.assert(test, message||"Assert failed");
            else if(!test)                                                  throw new Error("Assert failed" + (exists(message) ? ": " + message : ""));
        }
    );
    define
    (
        function info(message)  { if (exists(global.console) && exists(global.console.info))  global.console.info(message); }
    );
    info("Atomic debug namespace is present.");
}})(this);