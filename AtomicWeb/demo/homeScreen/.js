atomic.ready(function(global)
{with(namespace("demoSpace"))
{
    define
    ({
        class:      function HomeScreen(){},
        extends:    atomic.ui.Screen,
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
}});