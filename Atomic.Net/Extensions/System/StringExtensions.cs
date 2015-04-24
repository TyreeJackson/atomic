namespace AtomicNet
{

    public
    static  class   StringExtensions
    {

        public
        static  string  EndWith(this string thisString, string stringEnding)
        {
            if (thisString.IsNullOrEmpty() || stringEnding.IsNullOrEmpty()) return thisString;

            return  thisString.Substring(thisString.Length-stringEnding.Length) != stringEnding
                    ?   thisString + stringEnding
                    :   thisString;
        }

        public
        static  string  FormattedWith(this string thisString, params object[] args)
        {
            return System.String.Format(thisString, args);
        }

        public
        static  bool    IsNullOrEmpty(this string thisString)
        {
            return System.String.IsNullOrEmpty(thisString);
        }

        public
        static  string  OrIfNullOrEmpty(this string thisString, string defaultValue)
        {
            return thisString.IsNullOrEmpty() ? defaultValue : thisString;
        }

        public
        static  bool    HasAnyCharactersThatAreAnyOf(this string thisString, params char[] characters)
        {
            for (int charCounter = 0; charCounter < thisString.Length; charCounter++)   if (thisString[charCounter].IsOneOf(characters))    return true;
            return false;
        }

        public
        static  string  TrimEnd(this string thisString, string stringToTrim)
        {
            if (thisString.IsNullOrEmpty() || stringToTrim.IsNullOrEmpty()) return thisString;

            return  thisString.Substring(thisString.Length-stringToTrim.Length) == stringToTrim
                    ?   thisString.Substring(0, thisString.Length-stringToTrim.Length)
                    :   thisString;
        }

        public
        static  bool    EndsWithOneOf(this string thisString, params char[] values)
        {
            foreach(char value in values) if (thisString[thisString.Length-1] == value) return true;
            return  false;
        }

        public
        static  bool    EndsWithOneOf(this string thisString, params string[] values)
        {
            foreach(string value in values) if (thisString.EndsWith(value)) return true;
            return  false;
        }

        public
        static  bool    EndsWithOneOf(this string thisString, System.Collections.Generic.IEnumerable<string> values)
        {
            foreach(string value in values) if (thisString.EndsWith(value)) return true;
            return  false;
        }

    }

}
