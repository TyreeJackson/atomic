(function(global)
{with(namespace("debug"))
{with(namespace("test"))
{
    define
    ({
        class:      function BaseClass(){},
        static:
        function(base, privileged)
        {return{
            constructor:
            function()
            {
            }
        }},
        prototype:
        {
        },
        instance:   
        function(base, privileged)
        {return{
            constructor:
            function()
            {
            },
            protected:
            {
                bye:
                function(who)
                {
                    return "Bye " + who + "!";
                },
            },
            public:
            {
                hello:
                function(who)
                {
                    return "Hello " + who + "!";
                }
            }
        }}
    });
    define
    ({
        class:      function TestClass(){},
        extends:    BaseClass,
        static:
        function(base, privileged)
        {return{
            constructor:
            function()
            {
            }
        }},
        prototype:
        {
        },
        instance:   
        function(base, privileged)
        {return{
            constructor:
            function()
            {
            },
            protected:
            {
                bye:
                function(who)
                {
                    return base.bye(who) + " We'll miss you!";
                },
            },
            public:
            {
                hello:
                function(who)
                {
                    return "Whoa! " + base.hello(who);
                },
                goodBye:
                function(who)
                {
                    return "Doh! " + privileged.bye(who);
                }
            }
        }}
    });
    var test1   = new TestClass();
    alert(test1.hello("World"));
    alert(test1.goodBye("World"));
    assert(!exists(new TestClass().bye));
    
}}})(window);