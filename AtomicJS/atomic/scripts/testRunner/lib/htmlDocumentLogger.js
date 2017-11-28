!function()
{"use strict";root.define("atomic.htmlDocumentLogger",
function htmlDocumentLogger(loggerElement)
{
    return function log(message, color)
    {
        loggerElement.innerHTML += "<div style=\"color: " + (color||"black") + ";\">" + message + "</div>";
    }
});}();