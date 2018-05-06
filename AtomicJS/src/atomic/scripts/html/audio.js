!function(){"use strict";root.define("atomic.html.audio", function htmlAudio(control)
{
    function audio(elements, selector, parent, bindPath)
    {
        control.call(this, elements, selector, parent, bindPath);
        this.__binder.defineDataProperties(this,
        {
            autoplay:       {get: function(){return this.__element.autoplay},       set: function(value){this.__element.autoplay = value===true; this.getEvents("viewupdated").viewupdated(["autoplay"]);}},
            loop:           {get: function(){return this.__element.loop;},          set: function(value){this.__element.loop = value===true; this.getEvents("viewupdated").viewupdated(["loop"]);}},
            muted:          {get: function(){return this.__element.muted},          set: function(value){this.__element.muted = value===true; this.getEvents("viewupdated").viewupdated(["muted"]);}},
            nativeControls: {get: function(){return this.__element.controls;},      set: function(value){this.__element.controls = value===true; this.getEvents("viewupdated").viewupdated(["controls"]);}},
            preload:        {get: function(){return this.__element.preload;},       set: function(value){this.__element.preload = value===true; this.getEvents("viewupdated").viewupdated(["preload"]);}},
            alt:            {get: function(){return this.__element.alt;},           set: function(value){this.__element.alt = value||""; this.getEvents("viewupdated").viewupdated(["alt"]);}},
            mediaType:      {get: function(){return this.__element.type;},          set: function(value){this.__element.type = value||""; this.getEvents("viewupdated").viewupdated(["type"]);}},
            value:          {get: function(){return this.__getViewData("src");},    set: function(value){this.pause(); this.__setViewData("src", value||""); this.triggerEvent("timeupdate"); }},
            currentTime:    {get: function(){return this.__element.currentTime;},   set: function(value){this.__element.currentTime = value||0; this.getEvents("viewupdated").viewupdated(["currentTime"]);},   onchange: this.getEvents("timeupdate")},
            playbackRate:   {get: function(){return this.__element.playbackRate;},  set: function(value){this.__element.playbackRate = value||0; this.getEvents("viewupdated").viewupdated(["playbackRate"]);}, onchange: this.getEvents("ratechange")},
            volume:         {get: function(){return this.__element.volume;},        set: function(value){this.__element.volume = value||0; this.getEvents("viewupdated").viewupdated(["volume"]);},             onchange: this.getEvents("volumechange")}
        });
    }
    Object.defineProperty(audio, "prototype", {value: Object.create(control.prototype)});
    Object.defineProperty(audio, "__getViewProperty", {value: function(name) { return control.__getViewProperty(name); }});
    Object.defineProperties(audio.prototype,
    {
        constructor:    {value: audio},
        __createNode:   {value: function(){return document.createElement("audio");}, configurable: true},
        duration:       {value: function(){return this.__element.duration;}},
        ended:          {value: function(){return this.__element.ended;}},
        paused:         {value: function(){return this.__element.paused;}},
        seeking:        {value: function(){return this.__element.seeking;}},
        load:           {value: function(){this.__element.load();}},
        play:           {value: function(){this.__element.play();}},
        pause:          {value: function(){this.__element.pause();}}
    });
    return audio;
});}();