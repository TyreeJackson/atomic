using System;
using System.Web;
using System.Threading;
using AtomicNet;

namespace AtomicNet.IIS
{

    public
    sealed  class IISHttpHandler : HostHandler, IHttpAsyncHandler
    {

        public
        sealed  class   AsyncResult : IAsyncResult
        {

            private     object              state;
            private     object              stateLock                           = new object();
            private     ManualResetEvent    resetEvent                          = null;
            private     bool                completedSynchronously              = false;
            private     bool                isCompleted                         = false;
            private     AsyncCallback       asyncCallback                       = null;

                        object              IAsyncResult.AsyncState             { get { return this.state; } }
                        WaitHandle          IAsyncResult.AsyncWaitHandle        { get { lock(this.stateLock)    return this.resetEvent = this.resetEvent ?? new ManualResetEvent(false); } }
                        bool                IAsyncResult.CompletedSynchronously { get { return this.completedSynchronously; } }
                        bool                IAsyncResult.IsCompleted            { get { return this.isCompleted; } }

            internal    void                CompleteRequest(bool completedSynchronously)
            {
                this.completedSynchronously = completedSynchronously;
                this.isCompleted            = true;
                lock(this.stateLock)    if (this.resetEvent != null)    this.resetEvent.Set();
                try
                {
                    if (this.asyncCallback != null) this.asyncCallback(this);
                }
                catch(System.Exception ex)
                {
                    #warning Log this exception when the Logging Service is implemented
                    throw;
                }
            }
        }

        bool            IHttpHandler.IsReusable                                     { get { return false; } }

        void            IHttpHandler.ProcessRequest(HttpContext context)            {}

        IAsyncResult    IHttpAsyncHandler.BeginProcessRequest
                        (
                            HttpContext     context, 
                            AsyncCallback   cb,
                            object          extraData
                        )
        {
            IAsyncResult    asyncResult = new AsyncResult();

            this.ProcessRequest(new IISHttpContext(context)).WhenDone(()=>cb(asyncResult), ex=>{throw ex;});

            return asyncResult;
        }

        void            IHttpAsyncHandler.EndProcessRequest(IAsyncResult result)    {}

    }

}
