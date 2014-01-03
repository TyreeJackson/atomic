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
            },
            protected:
            {
                bye:    {field: "Bye "}
            },
            public:
            {
                hello:  {field: "Hello "}
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
                    return privileged.static.bye + who + "!";
                },
            },
            public:
            {
                hello:
                function(who)
                {
                    return privileged.static.hello + who + "!";
                },
                byeBye:
                function(who)
                {
                    return privileged.bye(who) + " Goodbye!";
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
            },
            protected:
            {
                bye:    {field: "Goodbye "},
            },
            public:
            {
                hello:  {field: "Hellooo "}
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
    var test1   = new BaseClass();
    assert(test1.hello("World") == "Hello World!", "Test 1a");
    assert(test1.byeBye("World") == "Bye World! Goodbye!", "Test 1b");
    assert(!exists(test1.goodBye), "Test 1c");
    var test2   = new TestClass();
    assert(test2.hello("World") == "Whoa! Hellooo World!", "Test 2a");
    assert(test2.goodBye("World") == "Doh! Goodbye World! We'll miss you!", "Test 2b");
    assert(!exists(test2.bye), "Test 2c");
    
}}})(window);