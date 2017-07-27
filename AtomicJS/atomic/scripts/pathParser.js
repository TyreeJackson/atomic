!function()
{"use strict"; root.define("atomic.pathParserFactory", function pathParserFactory(tokenizer)
{
    const   LITERAL                     = 'literal';
    const   WORD                        = 'word';
    const   NUMERAL                     = 'numeral';
    const   openKeyDelimiter            = 'openKeyDelimiter';
    const   closeKeyDelimiter           = 'closeKeyDelimiter';
    const   propertyDelimiter           = 'propertyDelimiter';
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
            return new token(priv.value, LITERAL);
        }
        tokenizer.call(this, prot, reset, read, getToken);
    }
    Object.defineProperty(stringLiteralTokenizer, "prototype", {value: Object.create(tokenizer.prototype)});
    function wordTokenizer()
    {
        var firstLetterCharacters   = /[a-zA-Z_$]/;
        var wordCharacters          = /[a-zA-Z0-9_$]/;
        var priv                    =
        {
            value:  ""
        };
        var prot                    = {};
        function reset(){ priv.value = ""; }
        function read(currentChar)
        {
            var handled = false;
            if (!prot.isClosed && wordCharacters.test(currentChar))
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
            return new token(priv.value, WORD);
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
            return new token(priv.value, NUMERAL);
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

    var Operation   =
    Object.create({},
    {
        left:       {value: null, writable: true},
        operator:   {value: null, writable: true},
        right:      {value: null, writable: true}
    });

    function resolvePathSegment(root, segment, current, newBasePath, constructPath)
    {
        if (typeof segment === "string")        segment = {value: segment, type: 0};

        if (typeof segment.value === "object")  segment = {type: 0, value: segment.value.get({item: root.item, basePath: root.basePath})};

        if      (segment.value === "$root")
        {
            return {type: 0, target: root.item, newBasePath: []};
        }
        else if (segment.value === "$home")
        {
            var resolvedPath    = resolvePath({item: root.item, basePath: root.basePath, pathTracker: root.pathTracker}, {segments: [], prependBasePath: true}, false);
            return {type: 0, target: resolvedPath.value, newBasePath: root.basePath.split(".")};
        }
        else if (segment.value === "$parent")
        {
            newBasePath.pop();
            var resolvedPath    = resolvePath({item: root.item, basePath: newBasePath.join("."), pathTracker: root.pathTracker}, {segments: [], prependBasePath: true}, false);
            return {type: 0, target: resolvedPath.value, newBasePath: newBasePath};
        }
        else if (segment.value === "$key")
        {
            return {type: 1, value: newBasePath.length > 0 ? newBasePath[newBasePath.length-1] : undefined};
        }
        else if (segment.value === "$path")
        {
            return {type: 1, value: newBasePath.length > 0 ? newBasePath.join(".") : undefined};
        }
        else
        {
            newBasePath.push(segment.value);
            if (current[segment.value] === undefined)
            {
                if (constructPath)  current[segment.value]   = segment.type===0?{}:[];
                else                return {type: 1, value: undefined};
            }
            return {type: 0, target: current[segment.value], newBasePath: newBasePath};
        }
    }

    function resolvePath(root, paths, constructPath)
    {
        var segments        = paths.prependBasePath ? root.basePath.split(".").filter(segment=>segment).concat(paths.segments) : paths.segments;
        var current         = root.item;
        var newBasePath     = [];
        var segmentsLength  = segments.length-(constructPath?1:0);

        for(var segmentCounter=0;segmentCounter<segmentsLength;segmentCounter++)
        {
            var resolvedSegment = resolvePathSegment(root, segments[segmentCounter], current, newBasePath, constructPath);

            if (resolvedSegment.type === 1) return {value: resolvedSegment.value};
            else
            {
                current     = resolvedSegment.target;
                newBasePath = resolvedSegment.newBasePath;
            }
        }
        return constructPath ? {target: current, segment: segments[segments.length-1], basePath: newBasePath.join(".")} : {value: current, pathSegments: newBasePath};
    }

    function getDataPath(root, paths)
    {
        return resolvePath(root, paths, false).value;
    }

    function setDataPath(root, paths, value)
    {
        var resolved    = resolvePath(root, paths, true);
        var newValue    = value&&value.isObserver ? value.unwrap() : value;
        if (typeof resolved.segment.value === "object") resolved.segment.value.set({item: root.item, basePath: resolved.basePath}, newValue);
        else                                            resolved.target[resolved.segment.value]  = newValue;
    }

    function accessor(path) { return {get: root=>getDataPath(root, path), set: (root,value)=>setDataPath(root, path, value)}; }

    function parse(lexer)
    {
        function parse(depth)
        {
            var handled     = false;
            var nextType    = 0;
            var currentPath = {segments: [], prependBasePath: true};
            var needWord    = false;
            while(!lexer.getNextToken())
            {
                var token       = lexer.current.value;
                if (lexer.current.type === WORD)
                {
                    currentPath.segments.push({value: token, type: 0});
                    handled     = true;
                    needWord    = false;
                }
                else if (lexer.current.type === NUMERAL)
                {
                    handled     = true;
                    needWord    = false;
                    currentPath.segments.push({value: lexer.current.value, type: 1});
                }
                else if (!needWord)
                {
                    if (lexer.current.type === propertyDelimiter && currentPath.segments.length > 0)
                    {
                        handled     = true;
                        nextType    = 0;
                        needWord    = true;
                    }
                    else if (lexer.current.type === openKeyDelimiter && currentPath.segments.length > 0)
                    {
                        handled     = true;
                        currentPath.segments.push({value: parse(depth+1), type: 1});
                    }
                    else if (lexer.current.type === closeKeyDelimiter && currentPath.segments.length > 0 && depth > 0)
                    {
                        handled = true;
                        return currentPath.segments.length === 1 && currentPath.segments[0].type === 1 ? currentPath.segments[0].value : accessor(currentPath);
                    }
                    else if (currentPath.segments.length == 0 && depth > 0 && lexer.current.type === LITERAL)
                    {
                        var segment = lexer.current.value;
                        if (lexer.getNextToken() || lexer.current.type !== closeKeyDelimiter)   throw new Error ("Syntax error: Expected ']' but encountered " + (lexer.eof?"EOF":lexer.current.value) + " at position " + lexer.currentByteIndex + ".");
                        return segment;
                    }
                }

                if (handled == false)   throw new Error("Syntax error: An unexpected token " + token + " was encountered at position " + lexer.currentByteIndex + ".");
            }
            if (depth>0)    throw new Error("Syntax error: Unexpected EOF encountered");
            return accessor(currentPath);
        }
        return parse(0);
    }

    return Object.create({},
    {
        getTokenizers:  { value: function()
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
                new delimiterTokenizer(']', closeKeyDelimiter)
            ];
            return tokenizers;
        }},
        parser: { value: 
        function parser(lexer)
        {
            Object.defineProperties(this,
            {
                parse:  {value: function(input)
                {
                    lexer.read(input);
                    return parse(lexer);
                }}
            });
        }}
    });
});}();