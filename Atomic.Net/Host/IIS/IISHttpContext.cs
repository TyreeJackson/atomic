using System;
using System.Web;
using System.Security.Principal;

namespace AtomicNet.IIS
{

    public  class IISHttpContext : HostContext
    {

        internal        HttpContext                             context;

        public
        delegate        tComponent                              createComponent<tComponent>(IISHttpContext context);

        private         createComponent<IISHttpApplication>     createHttpApplication                       { get; set; }

        private         IISHttpApplication                      application;

        private         createComponent<IISHttpRequest>         createHttpRequest                           { get; set; }

        private         IISHttpRequest                          request;

        private         createComponent<IISHttpServerUtility>   createHttpServerUtility                     { get; set; }

        private         IISHttpServerUtility                    server;

        private         createComponent<IISHttpResponse>        createHttpResponse                          { get; set; }

        private         IISHttpResponse                         response;

        private         Func<IPrincipal, IISHostPrincipal>      createUser                                  { get; set; }

        private         IISHostPrincipal                        user;

        private         Func<IISHttpHandler>                    createHandler                               { get; set; }

        private         IISHttpHandler                          handler                                     = null;

        [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverage]
        public
        override        Exception[]                             AllErrors                                   { get { return this.context.AllErrors; } }

        public
        override        HostApplication                         ApplicationInstance
        {
            get
            {
                if (this.application == null)   this.application = this.createHttpApplication(this);
                return this.application;
            }
        }

        [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverage]
        public
        override        Exception                               Error                                       { get { return this.context.Error; } }

        public
        override        HostHandler                             Handler
        {
            get
            {
                if (this.handler == null)   this.handler = this.createHandler();
                return this.handler;
            }
        }

        public
        override        HostRequest                             Request
        {
            get
            {
                if (this.request == null)   this.request = this.createHttpRequest(this);
                return this.request;
            }
        }

        public
        override        HostResponse                            Response
        {
            get
            {
                if (this.response == null)  this.response = this.createHttpResponse(this);
                return this.response;
            }
        }

        public
        override        HostServerUtility                       Server
        {
            get
            {
                if (this.server == null)    this.server = this.createHttpServerUtility(this);
                return this.server;
            }
        }

        [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverage]
        public
        override        DateTime                                Timestamp                                   { get { return this.context.Timestamp; } }

        public
        override        HostPrincipal                           User
        {
            get
            {
                if (this.user == null)  this.user = this.createUser(this.context.User);
                return this.user;
            }
        }

        public                                                  IISHttpContext(HttpContext context)
        :
                                                                this
                                                                (
                                                                    context, 
                                                                    iisContext=>new IISHttpApplication(iisContext), 
                                                                    iisContext=>new IISHttpRequest(iisContext), 
                                                                    iisContext=>new IISHttpServerUtility(iisContext), 
                                                                    iisContext=>new IISHttpResponse(iisContext),
                                                                    user=>new IISHostPrincipal(user),
                                                                    ()=>new IISHttpHandler()
                                                                )
        {
        }

        internal                                                IISHttpContext
                                                                (
                                                                    HttpContext                             context,
                                                                    createComponent<IISHttpApplication>     createHttpApplication,
                                                                    createComponent<IISHttpRequest>         createHttpRequest,
                                                                    createComponent<IISHttpServerUtility>   createHttpServerUtility,
                                                                    createComponent<IISHttpResponse>        createHttpResponse,
                                                                    Func<IPrincipal, IISHostPrincipal>      createUser,
                                                                    Func<IISHttpHandler>                    createHandler
                                                                )
        {
            Throw<ArgumentNullException>.If(context==null, "context");
            this.context                    = context;
            this.createHttpApplication      = createHttpApplication;
            this.createHttpRequest          = createHttpRequest;
            this.createHttpResponse         = createHttpResponse;
            this.createHttpServerUtility    = createHttpServerUtility;
            this.createUser                 = createUser;
            this.createHandler              = createHandler;
        }

    }

}
