!function()
{"use strict";root.define("tutorial.appView", function()
{return function tutorialAppView(appViewAdapter)
{
    function setPage(pageNumber)
    {
        appViewAdapter.boundItem("currentPageNumber", pageNumber);
        appViewAdapter.on.pageChanged(pageNumber);
        appViewAdapter.controls.example1.toggleDisplay(pageNumber==1);
        appViewAdapter.controls.example2.toggleDisplay(pageNumber==2);
    }
    var adapterDefinition   =
    {
        controls:
        {
            prevousExampleButton:
            {
                onboundedupdate:    function(data){ this.toggleDisplay(data("examples.length")>0); this.toggleClass("disabled", data("currentPageNumber") <= 1); }, 
                onclick:            function(){ if(this.boundItem("currentPageNumber") > 1) setPage(this.boundItem("currentPageNumber") - 1); }
            },
            nextExampleButton:
            {
                onboundedupdate:    function(data){this.toggleDisplay(data("examples.length")>0); this.toggleClass("disabled", data("currentPageNumber") >= data("examples.length")); },
                onclick:            function(){ if(this.boundItem("currentPageNumber")<this.boundItem("examples.length")) setPage(this.boundItem("currentPageNumber") + 1); }
            },
            examplePageList:
            {
                repeat:
                {
                    examplePageListItemTemplate:
                    {
                        getKey:     function(item){ return "example" + item().id; },
                        onclick:    function(){ setPage(this.boundItem("pageNumber")); },
                        controls:
                        {
                            examplePageNumberLabel: { bindTo: "title" }
                        },
                        onboundedupdate:
                        function(data)
                        {
                            this.toggleClass("active", this.parent.parent.boundItem("currentPageNumber")==data("pageNumber"));
                        }
                    }
                },
                bindTo: "examples"
            },
            example1: {},
            example2: { hidden: true }
        },
        events:["pageChanged"]
    };
    return adapterDefinition;
}});}();