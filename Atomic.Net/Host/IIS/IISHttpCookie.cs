using System;
using System.Collections.Generic;
using System.Text;
using System.Web;
using AtomicNet;

namespace AtomicNet.IIS
{

    public  class IISHttpCookie : HostCookie
    {

        private     HttpCookie  cookie                                      = null;

        public      HttpCookie  Cookie                                      { get { return this.cookie; } }

        public                  IISHttpCookie(string name)                  : this(new HttpCookie(name))    {}

        public                  IISHttpCookie(HttpCookie cookie)            : base(cookie.Name)             { this.cookie = cookie; }

        public
        override    string      Domain                                      { get { return this.cookie.Domain; } set { this.cookie.Domain = value; } }

        public
        override    DateTime    Expires                                     { get { return this.cookie.Expires; } set { this.cookie.Expires = value; } }

        public
        override    bool        HasKeys                                     { get { return this.cookie.HasKeys; } }

        public
        override    bool        HttpOnly                                    { get { return this.cookie.HttpOnly; } set { this.cookie.HttpOnly = value; } }

        public
        override    string      Name                                        { get { return this.cookie.Name; } set { this.cookie.Name = value; } }

        public
        override    string      Path                                        { get { return this.cookie.Path; } set { this.cookie.Path = value; } }

        public
        override    bool        Secure                                      { get { return this.cookie.Secure; } set { this.cookie.Secure = value; } }

        public
        override    string      Value                                       { get { return this.cookie.Value; } set { this.cookie.Value = value; } }

        public
        override    Dictionary
                    <
                        string,
                        string
                    >           Values                                      { get { return this.cookie.Values.ConvertToDictionary(); } }

        public
        override    string      this[string key]                            { get { return this.cookie[key]; } set { this.cookie[key] = value; } }

    }

}
