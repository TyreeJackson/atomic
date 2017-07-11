!function()
{"use strict";root.define("atomic.interactiveTutorial.controls.editorControl", function(ace)
{return {
    properties:
    {
        value:
        {
            bound:      true,
            get:        function(){return this.__editor.getValue();},
            set:        function(value){this.__editor.setValue(value||""); this.__editor.clearSelection();},
            onchange:   "change"
        },
        theme:
        {
            bound:  true, 
            get:    function(){return this.__editor.getTheme();},
            set:    function(value){this.__editor.setTheme(value); }
        },
        bind:   { get: function(){return this.value.bind;}, set: function(value){this.value.bind = value;}}
    },
    members:
    {
        focus:  function(){ this.__editor.focus(); }
    },
    extensions:
    [{
        initializers:
        {
            theme:  function(viewAdapter, value){this.theme = value;},
            mode:   function(viewAdapter, value){this.__editor.getSession().setMode("ace/mode/" + value);}
        },
        extend:
        function()
        {
            this.__editor   = ace.edit(this.__element);
            this.__editor.getSession().on("change", (function(e){this.triggerEvent("change");}).bind(this));
        }
    }]
};});}();