using System;
using System.Web;
using AtomicNet;

namespace AtomicNet.IIS
{

    public  class IISHttpContext : HostContext
    {

        private
        static          HttpContext                             currentContext                      { get { return HttpContext.Current; } }

        public
        delegate        tComponent                              createComponent<tComponent>(IISHttpContext context);

        private         createComponent<IISHttpApplication>     createHttpApplication               { get; set; }

        private         createComponent<IISHttpRequest>         createHttpRequest                   { get; set; }

        private         createComponent<IISHttpServerUtility>   createHttpServerUtility             { get; set; }

        private         createComponent<IISHttpResponse>        createHttpResponse                  { get; set; }

        private         HttpContext                             _context                            = null;
        internal        HttpContext                             context                             { get { return this._context; } }

        private         IISHttpApplication                      _application                        = null;
        private         IISHttpApplication                      application                         { get { return this._application??this.createHttpApplication(this); } }

        private         IISHttpRequest                          _request                            = null;
        private         IISHttpRequest                          request                             { get { return this._request??this.createHttpRequest(this); } }

        private         IISHttpServerUtility                    _server                             = null;
        private         IISHttpServerUtility                    server                              { get { return this._server??this.createHttpServerUtility(this); } }

        private         IISHttpResponse                         _response                           = null;
        private         IISHttpResponse                         response                            { get { return this._response??this.createHttpResponse(this); } }

        private         IISHttpHandler                          handler                             = null;

        public                                                  IISHttpContext(HttpContext context)
        :
                                                                this
                                                                (
                                                                    context, 
                                                                    iisContext=>new IISHttpApplication(iisContext), 
                                                                    iisContext=>new IISHttpRequest(iisContext), 
                                                                    iisContext=>new IISHttpServerUtility(iisContext), 
                                                                    iisContext=>new IISHttpResponse(iisContext)
                                                                )                                               {}

        internal                                IISHttpContext
                                                (
                                                    HttpContext                             context,
                                                    createComponent<IISHttpApplication>     createHttpApplication,
                                                    createComponent<IISHttpRequest>         createHttpRequest,
                                                    createComponent<IISHttpServerUtility>   createHttpServerUtility,
                                                    createComponent<IISHttpResponse>        createHttpResponse
                                                )
        {
            Throw<ArgumentNullException>.If(context==null, "context");
            this._context   = context;
            this.createHttpApplication      = createHttpApplication;
            this.createHttpRequest          = createHttpRequest;
            this.createHttpResponse         = createHttpResponse;
            this.createHttpServerUtility    = createHttpServerUtility;
        }

        public
        override        Exception[]         AllErrors                           { get { return this.context.AllErrors; } }

        public
        override        HostApplication     ApplicationInstance                 { get { return this.application; } }

        public
        override        Exception           Error                               { get { return this.context.Error; } }

        public
        override        HostHandler         Handler                             { get { return this.handler; } }

        public
        override        HostRequest         Request                             { get { return this.request; } }

        public
        override        HostResponse        Response                            { get { return this.response; } }

        public
        override        HostServerUtility   Server
        {
            get
            {
                return this.server;
            }
        }

        public
        override        DateTime            Timestamp                           { get { return this.context.Timestamp; } }

        public
        override        HostPrincipal       User
        {
            get
            {
                #warning NotImplemented
                throw new NotImplementedException();
            }
        }
    }

}
