(function()
{
    function each(array, callback) { for(var arrayCounter=0;arrayCounter<array.length;arrayCounter++) callback(array[arrayCounter]); }
    modules.define("each", function(){return each;});
})();