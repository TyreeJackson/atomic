using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AtomicNet
{

    public
    abstract
    partial     class   WebService : Component<WebService, WebService.ServiceArgs, WebService.BaseConfig>
    {

        public
        class       ServiceArgs{}

        public
        abstract    bool    IsReusable  { get; }

        protected           WebService(ServiceArgs args) : base(args) {}

    }

    public
    abstract
    partial 
    class       WebService<tWebService, tWebServiceArgs, tWebServiceConfig> : WebService
    where       tWebService                                                 : WebService<tWebService, tWebServiceArgs, tWebServiceConfig>
    where       tWebServiceArgs                                             : WebService<tWebService, tWebServiceArgs, tWebServiceConfig>.ServiceArgs
    where       tWebServiceConfig                                           : WebService<tWebService, tWebServiceArgs, tWebServiceConfig>.ServiceConfig
    {

        private
        static
        readonly    string      _name                                           = typeof(tWebService).Name;

        private
        static
        readonly    string      _factoryName                                    = typeof(tWebService).FullName + "+Factory";

        public
        override    bool        IsReusable                                      { get { return true; } }

        protected   RequestUser RequestedUser                                   { get { throw new NotImplementedException(); } }

        protected               WebService(tWebServiceArgs args)  : base(args)  {}

    }

}
