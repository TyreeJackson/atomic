using System;
using AtomicNet;

namespace AtomicNet
{

    public
    abstract
    partial     class   WebHandler   : Atom<WebHandler>
    {

        private     HostContext         context = null;

        protected   HostContext         Context     { get { return this.context; } }
        protected   HostRequest         Request     { get { return this.context.Request; } }
        protected   HostResponse        Response    { get { return this.context.Response; } }
        protected   HostServerUtility   Server      { get { return this.context.Server; } }

        internal    Promise             ProcessRequest(HostContext context)
        {
            return Atomic.Promise
            ((resolve, reject)=>
            {
                this.SetContext(context);
                if (Atomic.IsStillBooting)  this.RespondWithEnvironmentTemporarilyUnavailable().WhenDone(resolve, reject);
                else                        this.ProcessRequest().WhenDone(resolve, reject);
            });
        }

        private     void                SetContext(HostContext context)
        {
            Throw<ArgumentNullException>.If(context==null, "context");
            this.context    = context;
        }

        private     Promise             RespondWithEnvironmentTemporarilyUnavailable()
        {
            return Atomic.Promise
            ((resolve, reject)=>
            {
                this.Response.Clear();
                this.Response.StatusCode        = HttpStatusCodes.ServerError_ServiceUnavailable;
                this.Response.StatusDescription = "Site is waking up.  Please check back soon...";

                this.Response
                .AddHeader("Retry-After", ".1")
                .Write(@"<html><head><meta http-equiv=""refresh"" content=""1""></head><body><p>Site is waking up.  Please check back soon...</p></body></html>")
                .Flush();

                resolve();
            });
        }

        protected
        abstract    Promise             ProcessRequest();

    }

}
