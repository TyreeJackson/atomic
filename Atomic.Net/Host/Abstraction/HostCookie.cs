using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AtomicNet
{

    public
    abstract    class   HostCookie : Atom<HostCookie, string>
    {

        public                  HostCookie(string name) : base(name) {}

        public
        abstract    string      Domain                  { get; set; }

        public
        abstract    DateTime    Expires                 { get; set; }

        public
        abstract    bool        HasKeys                 { get; }

        public
        abstract    bool        HttpOnly                { get; set; }

        public
        abstract    string      Name                    { get; set; }

        public
        abstract    string      Path                    { get; set; }

        public
        abstract    bool        Secure                  { get; set; }

        public
        abstract    bool        Shareable               { get; set; }

        public
        abstract    string      Value                   { get; set; }

        public
        abstract    Dictionary
                    <
                        string,
                        string
                    >           Values                  { get; }

        public
        abstract    string      this[string key]        { get; set; }

    }

}
