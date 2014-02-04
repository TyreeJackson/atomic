(function(global)
{with(namespace("atomic"))
{
    define
    ({
        class:      function HTMLDomContext(){},
        extends:    BaseContext,
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
}})(this);