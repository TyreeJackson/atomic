using System;
using System.Collections.Specialized;
using System.Collections.Generic;
using AtomicNet.Dependencies.PublicDomain;

namespace AtomicNet
{

    public  static  class   NameValueCollectionExtensions
    {

        public  static  Dictionary<string, string>  ConvertToDictionary(this NameValueCollection collection)
        {
            Throw<ArgumentNullException>.If(collection==null, "collection");

            Dictionary<string, string>  returnDictionary    = new Dictionary<string,string>();
            foreach(string key in collection)   returnDictionary.Add(key, collection[key]);
            return returnDictionary;
        }

    }

}
