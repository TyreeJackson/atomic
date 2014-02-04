using System;
using System.Threading.Tasks;
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

        internal
        async       Task                ProcessRequest(HostContext context)
        {
            this.SetContext(context);
            if (Atomic.IsStillBooting)  await this.RespondWithEnvironmentTemporarilyUnavailable();
            else                        await this.ProcessRequest();
        }

        private     WebHandler          SetContext(HostContext context)
        {
            Throw<ArgumentNullException>.If(context==null, "context");
            this.context    = context;
            return this;
        }

        private
        async       Task                RespondWithEnvironmentTemporarilyUnavailable()
        {
            this.Response.Clear();
            this.Response.StatusCode        = HttpStatusCodes.ServerError_ServiceUnavailable;
            this.Response.StatusDescription = "Site is waking up.  Please check back soon...";

            this.Response
            .AddHeader("Retry-After", ".1")
            .Write(@"<html><head><meta http-equiv=""refresh"" content=""1""></head><body><p>Site is waking up.  Please check back soon...</p></body></html>")
            .Flush();
        }

        protected
        abstract    Task                ProcessRequest();

    }

}
