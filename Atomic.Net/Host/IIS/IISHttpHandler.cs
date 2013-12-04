using System;
using System.Web;
using System.Threading;
using AtomicNet;

namespace AtomicNet.IIS
{

    public  class IISHttpHandler : HostHandler, IHttpAsyncHandler
    {

        public  class   AsyncResult : IAsyncResult
        {
#warning NotImplemented
            object      IAsyncResult.AsyncState             { get { throw new NotImplementedException(); } }
#warning NotImplemented
            WaitHandle  IAsyncResult.AsyncWaitHandle        { get { throw new NotImplementedException(); } }
#warning NotImplemented
            bool        IAsyncResult.CompletedSynchronously { get { throw new NotImplementedException(); } }
#warning NotImplemented
            bool        IAsyncResult.IsCompleted            { get { throw new NotImplementedException(); } }

        }

        bool            IHttpHandler.IsReusable                             { get { return false; } }

        void            IHttpHandler.ProcessRequest(HttpContext context)    {}

        IAsyncResult    IHttpAsyncHandler.BeginProcessRequest(HttpContext context, AsyncCallback cb, object extraData)
        {
            IAsyncResult    asyncResult = new AsyncResult();

            this.ProcessRequest(new IISHttpContext(context)).WhenDone(()=>cb(asyncResult), ex=>{throw ex;});

            return asyncResult;
        }

        void            IHttpAsyncHandler.EndProcessRequest(IAsyncResult result)    {}

    }

}
