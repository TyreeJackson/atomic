!function()
{"use strict"; root.define("atomic.pathParserFactory", function pathParserFactory(tokenizer)
{
    const   LITERAL                     = 'literal';
    const   WORD                        = 'word';
    const   NUMERAL                     = 'numeral';
    const   openKeyDelimiter            = 'openKeyDelimiter';
    const   closeKeyDelimiter           = 'closeKeyDelimiter';
    const   propertyDelimiter           = 'propertyDelimiter';
    const   ROOTDIRECTIVE               = 'rootDirective';
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
    function operatorTokenizer(operatorToken, type)
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
            if (priv.currentIndex < operatorToken.length && currentChar === operatorToken[priv.currentIndex])
            {
                prot.isClosed   = false;
                priv.currentIndex++;
                handled         = true;
            }
            return handled;
        }
        function getToken()
        {
            return new token(operatorToken, type);
        }
        tokenizer.call(this, prot, reset, read, getToken);
    }
    Object.defineProperty(operatorTokenizer, "prototype", {value: Object.create(tokenizer.prototype)});

    function resolvePathSegment(root, segment, current, newBasePath, constructPath, notify)
    {
        if (typeof segment === "string")        segment = {value: segment, type: 0};

        if (typeof segment.value === "object")  segment = {type: 0, value: segment.value.get({bag: root.bag, basePath: root.basePath}, notify).value};

        if      (segment.value === "$root" || segment.value === "...")
        {
            return {type: 0, target: root.bag.item, newBasePath: []};
        }
        else if (segment.value === "$home")
        {
            var resolvedPath    = resolvePath({bag: root.bag, basePath: root.basePath, pathTracker: root.pathTracker}, {segments: [], prependBasePath: true}, false);
            return {type: 0, target: resolvedPath.value, newBasePath: root.basePath.split(".")};
        }
        else if (segment.value === "$parent")
        {
            newBasePath.pop();
            var resolvedPath    = resolvePath({bag: root.bag, basePath: newBasePath.join("."), pathTracker: root.pathTracker}, {segments: [], prependBasePath: true}, false);
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
                else                return {type: 1, value: undefined, newBasePath: newBasePath};
            }
            return {type: 0, target: current[segment.value], newBasePath: newBasePath};
        }
    }

    function resolvePath(root, paths, constructPath, notify)
    {
        var segments        = paths.prependBasePath ? root.basePath.split(".").filter(segment=>segment).concat(paths.segments) : paths.segments;
        var current         = root.bag.item;
        var newBasePath     = [];
        var segmentsLength  = segments.length-(constructPath?1:0);

        for(var segmentCounter=0;segmentCounter<segmentsLength;segmentCounter++)
        {
            var resolvedSegment = resolvePathSegment(root, segments[segmentCounter], current, newBasePath, constructPath, notify);

            if (resolvedSegment.type === 1) return {value: resolvedSegment.value, pathSegments: resolvedSegment.newBasePath};
            else
            {
                current     = resolvedSegment.target;
                newBasePath = resolvedSegment.newBasePath;
            }
        }
        return  constructPath
                ?   segmentsLength === -1
                    ?   {isRoot: true}
                    :   {target: current, segment: segments[segments.length-1], basePath: newBasePath.join(".")}
                :   {value: current, pathSegments: newBasePath};
    }

    function getDataPath(root, paths, notify)
    {
        var result  = resolvePath(root, paths, false, notify);
        if (typeof notify === "function")   notify(result.pathSegments);
        return result;
    }

    function setDataPath(root, paths, value, notify)
    {
        var resolved    = resolvePath(root, paths, true);
        var newValue    = value&&value.isObserver ? value.unwrap() : value;

        if      (resolved.isRoot)
        {
            root.bag.item   = value;
            if (typeof notify === "function")   notify("");
        }
        else if (typeof resolved.segment.value === "object")
        {debugger;
            resolved.segment.value.set({bag: root.bag, basePath: resolved.basePath}, newValue);
            debugger;
        }
        else
        {
            resolved.target[resolved.segment.value]  = newValue;
            if (typeof notify === "function")   notify((resolved.basePath.length>0?resolved.basePath+".":"")+resolved.segment.value);
        }
    }

    function accessor(path) { return {get: (root, notify)=>getDataPath(root, path, notify), set: (root,value, notify)=>setDataPath(root, path, value, notify)}; }

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
                if (lexer.current.type === WORD || lexer.current.type === ROOTDIRECTIVE)
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

                if (handled == false)   {debugger; throw new Error("Syntax error: An unexpected token " + token + " was encountered at position " + lexer.currentByteIndex + ".");}
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
                new operatorTokenizer("...", ROOTDIRECTIVE),
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
                    lexer.read(input!==undefined&&input!==null&&typeof input !== "string"?input.toString():input);
                    return parse(lexer);
                }}
            });
        }}
    });
});}();