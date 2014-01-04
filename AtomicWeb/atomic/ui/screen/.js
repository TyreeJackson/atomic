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
                if (exists(elements))
                for(var key in elements)    privileged.elements[key]    = privileged.byClass(elements[key]);
            },
            protected:
            {
                control:    {field: privileged.static.template.cloneNode(true)},
                elements:   {field: {}}
            }
        }}
    });
}});