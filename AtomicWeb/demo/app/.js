atomic.ready(function(global)
{with(namespace("demoSpace"))
{
    define
    ({
        class:      function Demo(){},
        extends:    atomic.BaseApplication,
        instance:   function(base, privileged)
        {return{
            constructor:
            function()
            {
                base({appName: "demo"});
            },
            public:
            {
                launch: function(){new HomeScreen().dock();}
            }
        }}
    });
    new Demo();
}});