(function(global)
{
    var references      = {};
    var readyCallbacks  = [];

    function getDependencies(reference, loadedReferences)
    {
        var dependencies    = [];
        if (reference.dependencies !== null)
        for(var dependencyCounter=0;dependencyCounter<reference.dependencies.length;dependencyCounter++)
        {
            var dependencyName  = reference.dependencies[dependencyCounter];
            if (loadedReferences.indexOf(dependencyName) > -1) throw new Error("Circular dependency encountered between " + reference.name + " and " + dependencyName + ".");
            dependencies.push(getReference(dependencyName, loadedReferences));
        }
        return dependencies;    
    }

    function linkReference(reference, loadedReferences)
    {
        return new (reference.factory.bind.apply(reference.factory, getDependencies(reference, [referenceName].concat(loadedReferences))))();
    }

    function getReference(referenceName, loadedReferences)
    {
        var reference   = references[referenceName];
        if (reference === undefined)            throw new Error("Reference with name " + referenceName + " was not found. Did you remember to load it?");
        if (reference.library === undefined)    reference.library = linkReference(reference, loadedReferences);
        return reference.library;
    }

    global.references   =
    {
        /*
        usage:
        references.define
        (
            referenceName:string,           // name of the reference being defined
            [dependencies:array[:string]],  // array of names of registered dependencies to inject into the reference when it is constructed
            factory:function                // function containing the reference to construct
        );
        */
        define:
        function (referenceName, dependencies, reference)
        {
            if (reference === undefined)
            {
                reference       = dependencies;
                dependencies    = null;
            }
            references[referenceName] = { name: referenceName, dependencies: dependencies, factory: factory };
        }
    };

    global.define = global.references.define;

})(window);