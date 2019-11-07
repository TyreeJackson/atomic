!function(){"use strict";root.define("atomic.scanner", function scanner()
{
    var priv    =
    {
        input:              "",
        currentByteIndex:   -1,
        currentColumnIndex: 0,
        currentLineNumber:  0,
        currentChar:        ""
    };
    var scanner = Object.create({},
    {
        read:   {value:
        function(input)
        {
            priv.input              = input;
            priv.currentByteIndex   = -1;
            priv.currentColumnIndex = 0;
            priv.currentLineNumber  = 0;
        }},
        scan:   {value:
        function()
        {
            priv.currentByteIndex++;
            if (priv.currentByteIndex < priv.input.length)
            {
                priv.currentChar    = priv.input[priv.currentByteIndex];
                if
                (
                    priv.currentByteIndex > 0
                    &&
                    priv.input[priv.currentByteIndex-1] == '\n'
                )
                {
                    priv.currentLineNumber++;
                    priv.currentColumnIndex = -1;
                }
                priv.currentColumnIndex++;
            }
            return priv.currentByteIndex < priv.input.length;
        }},
        stepBack:   {value:
        function()
        {
            if (priv.currentByteIndex <= 0) throw new Error("Scanner is already at position 0.")
            priv.currentByteIndex--;
            if (priv.input[priv.currentByteIndex] == '\n')  priv.currentLineNumber--;
        }},
        currentByteIndex:   { get: function(){ return priv.currentByteIndex; } },
        currentColumnIndex: { get: function(){ return priv.currentColumnIndex; } },
        currentLineNumber:  { get: function(){ return priv.currentLineNumber; } },
        current:            { get: function(){ return priv.currentChar; } },
        eof:                { get: function(){ return priv.input === undefined || priv.input === null || priv.currentByteIndex >= priv.input.length-1; } },
        input:              { get: function(){ return priv.input; } }
    });
    return scanner;
});}();