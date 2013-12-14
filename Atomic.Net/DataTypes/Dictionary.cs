using AtomicNet;

namespace AtomicNet
{

    public
    class   Dictionary<tKey, tValue>
    :
            System.Collections.Generic.Dictionary<tKey, tValue>
    {

        public
        tSubValue   TryReturnValueAs<tSubValue>(tKey key, tSubValue defaultValue)
        where       tSubValue   : tValue
        {
            tValue  value   = defaultValue;
            this.TryGetValue(key, out value);
            return value is tSubValue ? (tSubValue) value : defaultValue;
        }

    }

}
