!function()
{"use strict";root.define("atomic.interactiveTutorial.controls.markdownControl", function(marked)
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
    members:
    {
        scrollTo:   function(position){this.__element.scrollTop = position;}
    }
};});}();