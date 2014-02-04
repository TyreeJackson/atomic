atomic.ready(function(global)
{with(namespace("atomic")("ui"))
{
    define
    ({
        class:      function Screen(){},
        extends:    Control,
        static:     function(base, privileged)
        {return{
            constructor:
            function(elementId)
            {
                base(elementId);
            }
        }},
        instance:   function(base, privileged)
        {return{
            constructor:
            function(elements)
            {
                base(elements);
            },
            protected:
            {
            }
        }}
    });
}});