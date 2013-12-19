using AtomicNet;

namespace AtomicNet
{

    public
    static  class   StringExtensions
    {

        public
        static  bool    IsNullOrEmpty(this string thisString)
        {
            return System.String.IsNullOrEmpty(thisString);
        }

        public
        static  string  TrimEnd(this string thisString, string stringToTrim)
        {
            if (thisString.IsNullOrEmpty() || stringToTrim.IsNullOrEmpty()) return thisString;

            return  thisString.Substring(thisString.Length-stringToTrim.Length) == stringToTrim
                    ?   thisString.Substring(0, thisString.Length-stringToTrim.Length)
                    :   thisString;
        }

    }

}
