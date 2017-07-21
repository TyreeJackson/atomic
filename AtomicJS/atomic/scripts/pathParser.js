!function()
{"use strict"; root.define("atomic.pathParser", function pathParser(tokenizer)
{
    const   literal                     = 'literal';
    const   word                        = 'word';
    const   numeral                     = 'numeral';
    const   openKeyDelimiter            = 'openKeyDelimiter';
    const   closeKeyDelimiter           = 'closeKeyDelimiter';
    const   openParenDelimiter          = 'openParenDelimiter';
    const   closeParenDelimiter         = 'closeParenDelimiter';
    const   propertyDelimiter           = 'propertyDelimiter';
    const   operator                    = 'operator';
    const   EOF                         = 'EOF';
    function token(value, type) { return Object.create({},{value: {value: value}, type: {value: type} }); }
    function stringLiteralTokenizer(delimiter, failOnCarriageReturnOrLineBreak)
    {
        // This tokenizer allows for slash delimiter escaping but not double delimiter escaping
        var priv    =
        {
            value:  ""
        };
        var prot    = {};
        function reset(){ priv.value = ""; }
        function read(currentChar)
        {
            var handled = false;
            if (prot.isClosed && currentChar==delimiter && priv.value.length == 0)
            {
                prot.isClosed   = false;
                handled         = true;
            }
            else if(!prot.isClosed && (!failOnCarriageReturnOrLineBreak || (currentChar != "\r" && currentChar != "\n")))
            {
                if (currentChar==delimiter && (priv.value.length == 0 || priv.value.slice(-1) != "\\")) prot.isClosed   = true;
                else                                                                                    priv.value      += currentChar;

                handled         = true;
            }
            return handled;
        }
        function getToken()
        {
            return new token(priv.value, literal);
        }
        tokenizer.call(this, prot, reset, read, getToken);
    }
    Object.defineProperty(stringLiteralTokenizer, "prototype", {value: Object.create(tokenizer.prototype)});
    function wordTokenizer()
    {
        var firstLetterCharacters   = /[a-zA-Z]_$/;
        var wordCharacters          = /[a-zA-Z0-9]_$/;
        var priv                    =
        {
            value:  ""
        };
        var prot                    = {};
        function reset(){ priv.value = ""; }
        function read(currentChar)
        {
            var handled = false;
            if (!prot.isClosed && wordCharaters.test(currentChar))
            {
                priv.value  += currentChar;
                handled     = true;
            }
            else if (prot.isClosed && firstLetterCharacters.test(currentChar))
            {
                prot.isClosed   = false;
                priv.value      = currentChar;
                handled         = true;
            }
            return handled;
        }
        function getToken()
        {
            return new token(priv.value, word);
        }
        tokenizer.call(this, prot, reset, read, getToken);
    }
    Object.defineProperty(wordTokenizer, "prototype", {value: Object.create(tokenizer.prototype)});
    function numeralTokenizer()
    {
        var numerals    = /[0-9]/;
        var priv        =
        {
            value:  ""
        };
        var prot        = {};
        function reset(){ priv.value = ""; }
        function read(currentChar)
        {
            var handled = false;
            if (numerals.test(currentChar))
            {
                if (prot.isClosed)  prot.isClosed   = false;
                priv.value  += currentChar;
                handled     = true;
            }
            return handled;
        }
        function getToken()
        {
            return new token(priv.value, numeral);
        }
        tokenizer.call(this, prot, reset, read, getToken);
    }
    Object.defineProperty(numeralTokenizer, "prototype", {value: Object.create(tokenizer.prototype)});
    function delimiterTokenizer(delimiter, type)
    {
        var priv    =
        {
            value:  ""
        };
        var prot    = {};
        function reset(){ priv.value = ""; }
        function read(currentChar)
        {
            var handled = false;
            if (currentChar === delimiter && prot.isClosed)
            {
                priv.value      = currentChar;
                prot.isClosed   = false;
                handled         = true;
            }
            return handled;
        }
        function getToken()
        {
            return new token(priv.value, type);
        }
        tokenizer.call(this, prot, reset, read, getToken);
    }
    Object.defineProperty(delimiterTokenizer, "prototype", {value: Object.create(tokenizer.prototype)});
    function operatorTokenizer(operator)
    {
        var priv    =
        {
            currentIndex:   0
        };
        var prot    = {};
        function reset(){ priv.currentIndex = 0; }
        function read(currentChar)
        {
            var handled = false;
            if (priv.currentIndex < operator.length && currentChar === operator[priv.currentIndex])
            {
                prot.isClosed   = false;
                priv.currentIndex++;
                handled         = true;
            }
            return handled;
        }
        function getToken()
        {
            return new token(operator, operator);
        }
        tokenizer.call(this, prot, reset, read, getToken);
    }
    Object.defineProperty(delimiterTokenizer, "prototype", {value: Object.create(tokenizer.prototype)});

    var Operation   =
    Object.create({},
    {
        left:       {value: null, writable: true},
        operator:   {value: null, writable: true},
        right:      {value: null, writable: true}
    });

    function navDataPath(root, paths, set, value)
    {
        if (paths.length == 0)
        {
            if(!set)    return root.item;
            root.item   = value;
            return;
        }
        var current     = root.item;
        for(var pathCounter=0;pathCounter<paths.length-1;pathCounter++)
        {
            var path    = paths[pathCounter];

            if (typeof path === "function") path    = path(root);

            if (current[path.value] === undefined)
            {
                if (value !== undefined)    current[path.value]   = path.type===0?{}:[];
                else                        return undefined;
            }
            current     = current[path.value];
        }
        if (!set)   return current[paths[paths.length-1].value];
        current[paths[paths.length-1].value]    = value&&value.isObserver ? value.unwrap() : value;
    }

    var operators   = Object.create({},
    {
        "==":   (left, right)=>left==right,
        "!=":   (left, right)=>left!=right,
        "<":    (left, right)=>left<right,
        "<=":   (left, right)=>left<=right,
        ">":    (left, right)=>left>right,
        ">=":   (left, right)=>left>=right,
    });
    function value(value)                           { return {get: root=>value}; }
    function accessor(path)                         { return {get: root=>navDataPath(root, path), set: (root,value)=>navDataPath(root, path, true, value)}; }
    function compare(left, operator, right)         { return {get: root=>operators[operator](left.get(root), right.get(root))}; }
    function boolCheck(value)                       { return {get: root=>value.get(root)}; }
    function invokeFunction(functionName, criteria) { return {get: root=>functions[functionName]()}}

    function parseFunction(functionName, depth)
    {
        var handled = false;
        lexer.getNextToken();
        if (lexer.eof || lexer.current.type !== openParenDelimiter)         throw new Error("Syntax error: A open paren was expected but instead " + (lexer.eof ? "EOF" : lexer.current.value + " was encountered.");

        var left    = parse(depth+1);
        if      (lexer.eof)                                                 throw new Error("Syntax error: An operator or a close paren was expected but instead EOF was encountered.");
        else if (lexer.current.type === closeParenDelimiter)                return boolCheck(left);
        else if (lexer.current.type === operator)
        {
            var operator    = lexer.current.value;
            var right       = parse(depth+1);
            if (lexer.eof || lexer.current.type !== closeParenDelimiter)    throw new Error("Syntax error: A close paren was expected but instead " + (lexer.eof ? "EOF" : lexer.current.value + " was encountered.");
            return compare(left, operator, right);
        }
        else                                                                throw new Error("Syntax error: An unexpected token " + lexer.current.value + " was encountered at position " + lexer.currentByteIndex + ".");
    }

    function parse(depth)
    {
        var handled     = false;
        var currentPath = [];
        while(!lexer.getNextToken())
        {
            var token       = lexer.current.value;
            var needWord    = false;
            if (lexer.current.type === word)
            {
                if      (token === "$root")     {currentPath = []; handled = true;}
                else if (token === "$home")     {currentPath = basePath.slice(); handled = true;}
                else if (token === "$parent")   {currentPath.pop(); handled = true;}
                else if (token === "$key")      {currentPath.push(value(currentPath[currentPath.length-1])); handled = true;}
                else if (token === "$path")     {currentPath.push(value(currentPath.join("."))); handled = true;}
                else if 
                (
                    token === "$first"
                    ||
                    token === "$last"
                    ||
                    token === "$all"
                )                               {currentPath.push(parseFunction(token, depth+1)); handled = true;}
                else                            {currentPath.push(token); handled = true;}
                needWord    = false;
            }
            else if (lexer.current.type === numeral)
            {
                handled     = true;
                needWord    = false;
                currentPath.push(lexer.current.value);
            }
            else if (!needWord)
            {
                if (lexer.current.type === propertyDelimiter && currentPath.length > 0)
                {
                    handled = true;
                }
                else if (lexer.current.type === openKeyDelimiter && currentPath.length > 0)
                {
                    handled = true;
                    currentPath.push(parse(depth+1));
                }
                else if (lexer.current.type === closeKeyDelimiter && currentPath.length > 0 && depth > 0)
                {
                    handled = true;
                    return accessor(currentPath);
                }
            }

            if (handled == false)   throw new Error("Syntax error: An unexpected token " + token + " was encountered at position " + lexer.currentByteIndex + ".");
        }
        if (depth>0)    throw new Error("Syntax error: Unexpected EOF encountered");
        return accessor(currentPath);
    }

    return Object.create({},
    {
        tokenizers: { get: { function()
        {
            var tokenizers  =
            [
                new stringLiteralTokenizer("'", true),
                new stringLiteralTokenizer("\"", true),
                new stringLiteralTokenizer("`", false),
                new wordTokenizer(),
                new numeralTokenizer(),
                new delimiterTokenizer('.', propertyDelimiter),
                new delimiterTokenizer('[', openKeyDelimiter),
                new delimiterTokenizer(']', closeKeyDelimiter),
                new delimiterTokenizer('(', openParenDelimiter),
                new delimiterTokenizer(')', closeParenDelimiter),
                new operatorTokenizer('=='),
                new operatorTokenizer('!='),
                new operatorTokenizer('<'),
                new operatorTokenizer('<='),
                new operatorTokenizer('>'),
                new operatorTokenizer('>=')
            ];
            return tokenizers;
        }}},
        parser:
        function parser(lexer, input, basePath)
        {
            Object.defineProperties(this,
            {
                parse:  {value: function(input, depth)
                {
                    lexer.read(input);
                    return parse(0);
                }}
            });
        }
    });
});}();