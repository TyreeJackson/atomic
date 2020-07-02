!function(){"use strict";root.define("atomic.html.file", function htmlFile(control)
{
    function useReader(use, callback, errorCallback)
    {
        var reader  = new FileReader();
        function handleloadend()
        {
            reader.removeEventListener("loadend", handleloadend);
            callback(reader.result);
            reader  = null;
        }
        reader.addEventListener("loadend", handleloadend);
        function handleerror()
        {
            reader.removeEventListener("error", handleerror);
            errorCallback();
            reader  = null;
        }
        reader.addEventListener("error", handleerror);
        use(reader);
    }
    function File(htmlFile)
    {
        Object.defineProperty(this, "__file", {value: htmlFile, configurable: true});
        Object.defineProperties(this,
        {
            lastModified:       {get: function(){return this.__file.lastModified;}, enumerable: true},
            lastModifiedDate:   {get: function(){return this.__file.lastModifiedDaate;}, enumerable: true},
            name:               {get: function(){return this.__file.name;}, enumerable: true},
            size:               {get: function(){return this.__file.size;}, enumerable: true},
            type:               {get: function(){return this.__file.type;}, enumerable: true}
        });
    }
    Object.defineProperties(File.prototype,
    {
        readAsArrayBuffer:  {value: function(callback, errorCallback){useReader((function(reader){reader.readAsArrayBuffer(this.__file);}).bind(this), callback, errorCallback)}},
        readAsBinaryString: {value: function(callback, errorCallback){useReader((function(reader){reader.readAsBinaryString(this.__file);}).bind(this), callback, errorCallback)}},
        readAsDataURL:      {value: function(callback, errorCallback){useReader((function(reader){reader.readAsDataURL(this.__file);}).bind(this), callback, errorCallback)}},
        readAsText:         {value: function(callback, errorCallback){useReader((function(reader){reader.readAsText(this.__file);}).bind(this), callback, errorCallback)}}
    });
    function adapt(htmlFiles)
    {
        var returnFiles = [];
        for(var counter=0, htmlFile; (htmlFile=htmlFiles[counter++]) !== undefined;)  returnFiles.push(new File(htmlFile));
        return returnFiles;
    }
    function file(elements, selector, parent, bindPath, childKey, protoChildKey)
    {
        control.call(this, elements, selector, parent, bindPath, childKey, protoChildKey);
        this.__binder.defineDataProperties(this,
        {
            value:  {get: function(){return adapt(this.__element.files);}, set: function(value){},  onchange: this.getEvents("change")}
        });
    }
    Object.defineProperty(file, "prototype", {value: Object.create(control.prototype)});
    Object.defineProperty(file, "__getViewProperty", {value: function(name) { return control.__getViewProperty(name); }});
    Object.defineProperties(file.prototype,
    {
        constructor:    {value: file},
        __createNode:   {value: function(){var element = document.createElement("input"); element.type="file"; return element;}, configurable: true}
    });
    return file;
});}();