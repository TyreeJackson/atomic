using AtomicNet;

namespace AtomicNet
{

    public
    static  class   StructExtensions
    {

        public
        static  bool    IsOneOf<t>(this t thisItem, params t[] values) where t : System.IEquatable<t>
        {
            foreach(t value in values)  if (thisItem.Equals(value)) return true;
            return  false;
        }

        public
        static  bool    IsOneOf<t>(this t thisItem, System.Collections.Generic.IEnumerable<t> values) where t : System.IEquatable<t>
        {
            foreach(t value in values)  if (thisItem.Equals(value)) return true;
            return  false;
        }

    }

}
