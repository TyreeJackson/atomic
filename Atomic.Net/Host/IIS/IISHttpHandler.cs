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

            object      IAsyncResult.AsyncState             { get { throw new NotImplementedException(); } }

            WaitHandle  IAsyncResult.AsyncWaitHandle        { get { throw new NotImplementedException(); } }

            bool        IAsyncResult.CompletedSynchronously { get { throw new NotImplementedException(); } }

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
