atomic.ready(function(global)
{with(namespace("atomic")("ui"))
{
    var canvas  = atomic.application.byId("canvas");
    define
    ({
        class:      function Control(){},
        static:     function(base, privileged)
        {return{
            constructor:
            function(elementId)
            {
                if (!exists(elementId))             return;

                privileged.template = atomic.application.byId(elementId);
                if (!exists(privileged.template))   return;

                var parentNode;
                if ((parentNode = privileged.template.parentNode).className == "templateContainer")
                {
                    parentNode.removeChild(privileged.template);
                    parentNode.parentNode.removeChild(parentNode);
                }
            },
            protected:
            {
                canvas:     {field: null},
                template:   {field: null}
            }
        }},
        instance:   function(base, privileged)
        {return{
            constructor:
            function(elements)
            {
                if (exists(elements))
                for(var key in elements)    privileged.elements[key]    = privileged.control.getElementsByClassName(elements[key]);
            },
            protected:
            {
                byClass:    function(className) { return privileged.control.getElementsByClassName(className)[0]; },
                control:    {field: privileged.static.template.cloneNode(true)},
                elements:   {field: {}}
            },
            public:
            {
                dock:
                function(parent)
                {
                    if (!exists(parent)) canvas.appendChild(privileged.control);
                }
            }
        }}
    });
}});