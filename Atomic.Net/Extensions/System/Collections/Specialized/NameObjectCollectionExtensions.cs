using System;
using System.Collections.Generic;
using System.Web;
using AtomicNet.Dependencies.PublicDomain;
using AtomicNet.IIS;

namespace AtomicNet
{

    public  static  class   HttpCookieCollectionExtensions
    {

        public  static  Dictionary<string, HostCookie>   ConvertToDictionary(this HttpCookieCollection collection)
        {
            Throw<ArgumentNullException>.If(collection==null, "collection");

            Dictionary<string, HostCookie>          returnDictionary    = new Dictionary<string,HostCookie>();
            foreach(string key in collection.Keys)  returnDictionary.Add(key, new IISHttpCookie(collection.Get(key)));
            return returnDictionary;
        }

    }

}
