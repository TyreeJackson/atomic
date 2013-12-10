using System;
using System.Web;
using AtomicNet;

namespace AtomicNet.IIS
{

    public  class IISHttpContext : HostContext
    {

        private static  HttpContext         currentContext                      { get { return HttpContext.Current; } }

        private         HttpContext         _context                            = null;
        internal        HttpContext         context                             { get { return this._context; } }

        private         IISHttpApplication  _application                        = null;
        private         IISHttpApplication  application                         { get { return HostApplication.CreateIfNeeded(ref this._application, this); } }

        private         IISHttpRequest      _request                            = null;
        private         IISHttpRequest      request                             { get { return HostRequest.CreateIfNeeded(ref this._request, this); } }

        private         IISHttpResponse     _response                           = null;
        private         IISHttpResponse     response                            { get { return HostResponse.CreateIfNeeded(ref this._response, this); } }

        private         IISHttpHandler      handler                             = null;

        public                              IISHttpContext(HttpContext context)
        {
            Throw<ArgumentNullException>.If(context==null, "context");
            this._context   = context;
        }


        public
        override        Exception[]         AllErrors                           { get { return this.context.AllErrors; } }

        public
        override        HostApplication     ApplicationInstance                 { get { return this.application; } }

        public
        override        Exception           Error                               { get { return this.context.Error; } }

        public
        override        HostHandler         Handler                             { get { return this.handler; } }

        public override HostRequest Request
        {
            get
            {
                return this.request;
            }
        }

        public override HostResponse Response
        {
            get
            {
                #warning NotImplemented
                throw new NotImplementedException();
            }
        }

        public override HostServerUtility Server
        {
            get
            {
                #warning NotImplemented
                throw new NotImplementedException();
            }
        }

        public override DateTime Timestamp
        {
            get
            {
                #warning NotImplemented
                throw new NotImplementedException();
            }
        }

        public override HostPrincipal User
        {
            get
            {
                #warning NotImplemented
                throw new NotImplementedException();
            }
        }
    }

}
