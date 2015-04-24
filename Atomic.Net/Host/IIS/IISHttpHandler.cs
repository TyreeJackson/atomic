using System;
using System.Web;

namespace AtomicNet.IIS
{

    public
    partial class IISHttpHandler : HostHandler, IHttpAsyncHandler
    {

        bool            IHttpHandler.IsReusable                                     { get { return false; } }

        void            IHttpHandler.ProcessRequest(HttpContext context)            { throw new InvalidOperationException("This handler must be called asynchronously."); }

        [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverage]
        public          IISHttpHandler() : this(new WebHandler.DefaultRouter())     {}

        internal        IISHttpHandler(WebHandler.Router router) : base(router)     {}

        IAsyncResult    IHttpAsyncHandler.BeginProcessRequest
                        (
                            HttpContext     context, 
                            AsyncCallback   cb,
                            object          extraData
                        )
        {
            IAsyncResult    asyncResult = new AsyncResult();

            this.ProcessRequest(new IISHttpContext(context)).ContinueWith(result=>cb(asyncResult));

            return asyncResult;
        }

        void            IHttpAsyncHandler.EndProcessRequest(IAsyncResult result)    {}

    }

}
