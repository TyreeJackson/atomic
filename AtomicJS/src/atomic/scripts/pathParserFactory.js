!function(){"use strict";root.define("atomic.pathParserFactory", function pathParserFactory(tokenizer)
{
    var LITERAL                     = 'literal';
    var WORD                        = 'word';
    var NUMERAL                     = 'numeral';
    var openKeyDelimiter            = 'openKeyDelimiter';
    var closeKeyDelimiter           = 'closeKeyDelimiter';
    var propertyDelimiter           = 'propertyDelimiter';
    var ROOTDIRECTIVE               = 'rootDirective';
    var EOF                         = 'EOF';
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

    function stringToSegment(segment){return typeof segment === "string" ? {value: segment, type: 0} : segment;}

    var unresolvedSegmentType   = 0;
    var resolvedSegmentType     = 1;
    var virtualSegmentType      = 2;

    function getNextVirtuals(segment, newBasePath, constructPath, currentVirtuals)
    {
        var nextVirtuals    = [];
        var virtualProperty = undefined;
        for(var virtualCounter=0;virtualCounter<currentVirtuals.length;virtualCounter++)
        {
            var currentVirtual  = currentVirtuals[virtualCounter];
            if (currentVirtual !== undefined)
            {
                if (currentVirtual.paths[segment.value] !== undefined)
                {
                    var nextVirtual = currentVirtual.paths[segment.value];
                    if (nextVirtual.property !== undefined)
                    {
                        if (nextVirtual.property.get === undefined) throw new Error("Computed property is write only at path '" + newBasePath.join(".") + "'.");
                        if (virtualProperty !== undefined)          throw new Error("A Computed property was already found at the path '" + newBasePath.join(".")+ "'.");

                        virtualProperty = {type: virtualSegmentType, virtualProperty: nextVirtual.property, target: nextVirtual.property.get(newBasePath.slice(0,-1).join("."), newBasePath[newBasePath.length-1]), newBasePath: newBasePath, currentVirtuals: nextVirtuals};
                    }
                    nextVirtuals.push(nextVirtual);
                }
                if(currentVirtual.matchers !== undefined)
                {
                    for(var counter=0;counter<currentVirtual.matchers.length;counter++)
                    {
                        var matcher = currentVirtual.matchers[counter];
                        if (matcher.test(segment.value))
                        {
                            if (matcher.property !== undefined)
                            {
                                if (matcher.property.get === undefined) throw new Error("Computed property is write only at path '" + newBasePath.join(".") + "'.");
                                if (virtualProperty !== undefined)      throw new Error("A Computed property was already found at the path '" + newBasePath.join(".")+ "'.");
                                virtualProperty = {type: virtualSegmentType, target: matcher.property.get(newBasePath.slice(0,-1).join("."), newBasePath[newBasePath.length-1]), newBasePath: newBasePath, currentVirtuals: nextVirtuals};
                            }
                            nextVirtuals.push(matcher);
                        }
                    }
                }
            }
        }
        return virtualProperty === undefined ? nextVirtuals : virtualProperty;
    }

    function resolvePathSegment(root, segment, current, newBasePath, constructPath, notify, currentVirtuals, ignoreVirtuals)
    {
        if (typeof segment.value === "object")  segment = {type: unresolvedSegmentType, value: segment.value.get({bag: root.bag, basePath: root.basePath}, notify).value};

        if      (segment.value === "$root" || segment.value === "...")
        {
            return {type: unresolvedSegmentType, target: root.bag.item, newBasePath: [], currentVirtuals: [root.bag.virtualProperties]};
        }
        else if (segment.value === "$home")
        {
            var resolvedPath    = resolvePath({bag: root.bag, basePath: root.basePath}, {segments: [], prependBasePath: true}, false);
            newBasePath         = root.basePath.split(".");
            return {type: unresolvedSegmentType, target: resolvedPath.value, newBasePath: newBasePath, currentVirtuals: resolvedPath.virtuals};
        }
        else if (segment.value === "$parent")
        {
            newBasePath.pop();
            var resolvedPath    = resolvePath({bag: root.bag, basePath: newBasePath.join(".")}, {segments: [], prependBasePath: true}, false);
            return {type: unresolvedSegmentType, target: resolvedPath.value, newBasePath: newBasePath, currentVirtuals: resolvedPath.virtuals};
        }
        else if (segment.value === "$shadow")
        {
            var shadowPath  = newBasePath.join(".");
            newBasePath.push(segment.value);
            if (root.bag.shadows[shadowPath] === undefined) root.bag.shadows[shadowPath]    = {};
            return {type: unresolvedSegmentType, target: root.bag.shadows[shadowPath], newBasePath: newBasePath, currentVirtuals: getNextVirtuals(segment, newBasePath, constructPath, currentVirtuals)};
        }
        else if (segment.value === "$key")
        {
            return {type: resolvedSegmentType , value: newBasePath.length > 0 ? newBasePath[newBasePath.length-1] : "$root", newBasePath: newBasePath};
        }
        else if (segment.value === "$path")
        {
            return {type: resolvedSegmentType, value: newBasePath.length > 0 ? newBasePath.join(".") : "$root", newBasePath: newBasePath};
        }
        else if (segment.value === "$rootPath")
        {
            return {type: resolvedSegmentType, value: "$root" + (newBasePath.length > 0 ? "." + newBasePath.join(".") : ""), newBasePath: newBasePath};
        }
        else
        {
            newBasePath.push(segment.value);
            var nextVirtuals;
            if (!ignoreVirtuals)
            {
                nextVirtuals    = getNextVirtuals(segment, newBasePath, constructPath, currentVirtuals);
                if (!Array.isArray(nextVirtuals))   return nextVirtuals;
            }

            // virtual only
            if (current === undefined)  return {type: resolvedSegmentType, value: undefined, newBasePath: newBasePath, currentVirtuals: nextVirtuals};

            if (current[segment.value] === undefined)
            {
                if (constructPath)  current[segment.value]   = segment.type===0?{}:[];
                else                return {type: resolvedSegmentType, value: undefined, newBasePath: newBasePath, currentVirtuals: nextVirtuals};
            }
            return {type: unresolvedSegmentType, target: current[segment.value], newBasePath: newBasePath, currentVirtuals: nextVirtuals};
        }
    }

    function resolvePath(root, paths, constructPath, notify, ignoreVirtuals)
    {
        var segments            = paths.prependBasePath ? root.basePath.split(".").filter(function(segment){return segment.length>0;}).concat(paths.segments) : paths.segments;
        var current             = root.bag.item;
        var currentVirtuals     = [root.bag.virtualProperties];
        var newBasePath         = [];
        var segmentsLength      = segments.length-(constructPath?1:0);

        for(var segmentCounter=0;segmentCounter<segmentsLength;segmentCounter++)
        {
            var resolvedSegment = resolvePathSegment(root, stringToSegment(segments[segmentCounter]), current, newBasePath, constructPath, notify, currentVirtuals, ignoreVirtuals);

            if (resolvedSegment.type === resolvedSegmentType && resolvedSegment.currentVirtuals === undefined)
            {
                return {value: resolvedSegment.value, pathSegments: resolvedSegment.newBasePath};
            }
            if (resolvedSegment.type === virtualSegmentType && resolvedSegment.target !== undefined && resolvedSegment.target !== null && resolvedSegment.target.isObserver)
            {
                if (typeof notify === "function")   notify(newBasePath);
                return resolvePath({bag: resolvedSegment.target.__bag, basePath: resolvedSegment.target.__basePath}, {prependBasePath: true, segments: segments.slice(segmentCounter+1)}, constructPath, notify);
            }

            current         = resolvedSegment.target==undefined && segmentCounter<segmentsLength-1 ? {} : resolvedSegment.target;
            newBasePath     = resolvedSegment.newBasePath;
            currentVirtuals = resolvedSegment.currentVirtuals;
        }
        if (constructPath && segmentsLength > -1 && (ignoreVirtuals || currentVirtuals.length > 0))
        {
            var finalSegment    = resolvePathSegment(root, stringToSegment(segments[segmentsLength]), current, newBasePath.slice(), true, notify, currentVirtuals, ignoreVirtuals);
            if (finalSegment.type === 2) return {isVirtual: true, property: finalSegment.virtualProperty, basePath: finalSegment.newBasePath.slice(0, -1).join("."), key: finalSegment.newBasePath[finalSegment.newBasePath.length-1]};
        }
        return  constructPath
                ?   segmentsLength === -1
                    ?   {isRoot: true}
                    :   {target: current, segment: stringToSegment(segments[segments.length-1]), basePath: newBasePath.join(".")}
                :   {value: current, pathSegments: newBasePath, virtuals: currentVirtuals};
    }

    function getDataPath(root, paths, notify, ignoreVirtuals)
    {
        var result  = resolvePath(root, paths, false, notify, ignoreVirtuals);
        if (typeof notify === "function")   notify(result.pathSegments);
        return result;
    }

    function setDataPath(root, paths, value, notify, ignoreVirtuals)
    {
        var resolved    = resolvePath(root, paths, true, undefined, ignoreVirtuals);
        var newValue    = value&&value.isObserver ? value.unwrap() : value;

        if      (resolved.isRoot)
        {
            root.bag.item   = value;
            if (typeof notify === "function")   notify("");
        }
        else if (resolved.isVirtual)
        {
            if (resolved.property.set === undefined)    throw new Error("Computed property is read-only.");
            resolved.property.set(resolved.basePath, resolved.key, newValue);
        }
        else if (typeof resolved.segment.value === "object")
        {
            resolved.segment.value.set({bag: root.bag, basePath: resolved.basePath}, newValue);
        }
        else
        {
            resolved.target[resolved.segment.value]  = newValue;
            if (typeof notify === "function")   notify((resolved.basePath.length>0?resolved.basePath+".":"")+resolved.segment.value);
        }
    }

    function accessor(path) { return {get: function(root, notify, ignoreVirtuals){return getDataPath(root, path, notify, ignoreVirtuals);}, set: function(root, value, notify, ignoreVirtuals){return setDataPath(root, path, value, notify, ignoreVirtuals);}}; }

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