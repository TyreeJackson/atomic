!function()
{"use strict";root.define("tutorial.appController", function tutorialAppController(appView, appProxy, observer)
{
    appView.on.pageChanged.listen
    (function(pageNumber)
    {
    });
    this.launch =
    function()
    {
        appView.bindData(new observer(
        {
            currentPageNumber:  1,
            examples:
            [
                {
                    pageNumber: 1,
                    title:      "Hello World"
                },
                {
                    pageNumber: 2,
                    title:      "Hello Friend"
                }
            ]
        }));
    }
});}();