!function()
{"use strict"; root.define("atomic.lexer", function lexer(scanner, tokenizers, removeFromArray)
{
    const   whiteSpaceCharacters    = /\s/;
    var priv    =
    {
        currentToken:   null
    };

    function resetTokenizers()
    {
        for(var counter=0, tokenizer;tokenizer=tokenizers[counter];counter++)   tokenizer.reset();
    }
    var lexer   = Object.create({},
    {
        read:           {value:
        function(input)
        {
            scanner.read(input);
            return this;
        }},
        getNextToken:   {value:
        function()
        {
            if (scanner.eof)    return true;
            var previousTokenizers  = [],
                activeTokenizers    = [],
                currentChar;
            
            while(scanner.scan())
            {
                currentChar = scanner.current;
                if (activeTokenizers.length > 0)
                {
                    previousTokenizers  = activeTokenizers.slice();
                    for(var counter=0, activeTokenizer;activeTokenizer=previousTokenizers[counter];counter++)
                    {
                        if (activeTokenizer.readChar(currentChar))  continue;
                        else                                        removeFromArray(activeTokenizer, counter);
                    }

                    if (activeTokenizers.length > 0)    continue;
                    else
                    {
                        if (!whiteSpaceCharacters.test(currentChar))    scanner.stepBack();
                        activeTokenizers    = previousTokenizers;
                        break;
                    }
                }
                activeTokenizers    = [];
                for(var counter=0, tokenizer;tokenizer=tokenizers[counter];counter++)   if (tokenizer.readChar(currentChar))    activeTokenizers.push(tokenizer);

                if (activeTokenizers.length == 0 && !whiteSpaceCharacters.test(currentChar))    throw new Error ("Invalid syntax.  Unable to tokenize statement.");
            }
            if (activeTokenizers.length == 0)   throw new Error ("Invalid syntax.  Unable to tokenize statement.");
            
            priv.currentToken   = activeTokenizers[0].getToken();
            resetTokenizers();
            return false;
        }},
        eof:                { get: function(){return scanner.eof;}},
        currentByteIndex:   { get: function(){return scanner.currentByteIndex;}},
        currentColumnIndex: { get: function(){return scanner.currentColumnIndex;}},
        currentLineNumber:  { get: function(){return scanner.currentLineNumber;}},
        current:            { get: function(){return priv.currentToken;}}
    });
});}();