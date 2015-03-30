using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AtomicNet
{

    public
    abstract
    partial     class   WebService : Atom<WebService>
    {

        public
        abstract    bool    IsReusable      { get; }

        protected           WebService()    {}

    }

    public
    abstract
    partial 
    class       WebService<tWebService> : WebService
    where       tWebService             : WebService<tWebService>
    {

        private
        static
        readonly    string      _name           = typeof(tWebService).Name;

        private
        static
        readonly    string      _factoryName    = typeof(tWebService).FullName + "+Factory";

        public
        override    bool        IsReusable      { get { return true; } }

        protected   RequestUser RequestedUser   { get { throw new NotImplementedException(); } }

        protected               WebService()    {}

    }

}
