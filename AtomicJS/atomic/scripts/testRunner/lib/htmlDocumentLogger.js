!function()
{"use strict";root.define("atomic.htmlDocumentLogger",
function htmlDocumentLogger(loggerElement)
{
    return function log(message)
    {
        loggerElement.innerHTML += message + "<br />";
    }
});}();