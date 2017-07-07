!function()
{"use strict";root.define("atomic.playground.controls.markdownControl", function(marked)
{return {
    properties:
    {
        value:
        {
            bound:      true,
            get:        function(){return this.__value;},
            set:        function(value){this.__element.innerHTML = marked(this.__value = value||"");}
        },
        bind:   { get: function(){return this.value.bind;}, set: function(value){this.value.bind = value;}}
    },
    extensions:
    [{
        initializers:
        {
            theme:  function(viewAdapter, value){this.__editor.setTheme(value);},
            mode:   function(viewAdapter, value){this.__editor.getSession().setMode("ace/mode/" + value);}
        }
    }]

};});}();