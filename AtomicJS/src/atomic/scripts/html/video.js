!function(){"use strict";root.define("atomic.html.video", function htmlVideo(audio)
{
    function video(elements, selector, parent, bindPath, childKey, protoChildKey)
    {
        audio.call(this, elements, selector, parent, bindPath, childKey, protoChildKey);
    }
    Object.defineProperty(video, "prototype", {value: Object.create(audio.prototype)});
    Object.defineProperty(video, "__getViewProperty", {value: function(name) { return audio.__getViewProperty(name); }});
    Object.defineProperties(video.prototype,
    {
        constructor:    {value: video},
        __createNode:   {value: function(){return document.createElement("video");}, configurable: true}
    });
    return video;
});}();