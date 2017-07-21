!function()
{"use strict"; root.define("atomic.tokenizer", function tokenizer()
{
    return function(prot, reset, read, getToken)
    {
        Object.defineProperties(prot,
        {
            isClosed:   {value: false, writable: true}
        });
        Object.defineProperties(this,
        {
            reset:      {value: function()
            {
                prot.isClosed   = true;
                reset.call(this);
                return this;
            }},
            read:       {value: read},
            getToken:   {value: getToken}
        });
    }
});}();