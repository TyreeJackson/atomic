atomic.ready(function(global)
{with(namespace("atomic")("ui"))
{with(namespace("demo"))
{
    define
    ({
        class:      function HomeScreen(){},
        extends:    Screen,
        static:     function(base, privileged)
        {return{
            constructor:
            function()
            {
                base("demo-homeScreen");
            }
        }},
        instance:   function(base, privileged)
        {return{
            constructor:
            function(elements)
            {
                base({title: "selTitle"});
                privileged.elements.title.style.color = "blue";
            }
        }}
    });
}}});