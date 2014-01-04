atomic.ready(function(global)
{with(namespace("atomic"))
{
    define
    ({
        class:      function HTMLDomApplication(){},
        extends:    BaseApplication,
        instance:   function(base, privileged)
        {return{
            constructor:
            function()
            {
                base(document);
            },
            public:
            {
            }
        }}
    });
}});