atomic.ready(function(global)
{with(namespace("atomic"))
{
    var apps    = {};
    Object.defineProperty
    (
        atomic,
        "apps",
        {
            value:          apps,
            configurable:   false,
            writable:       false
        }
    );

    define
    ({
        class:      function BaseApplication(){},
        instance:   function(base, privileged)
        {return{
            constructor:
            function(opts)
            {
                atomic.apps.defineProperty(opts.appName, {value: this, configurable: false, writable: false});
            }
        }}
    });
}});