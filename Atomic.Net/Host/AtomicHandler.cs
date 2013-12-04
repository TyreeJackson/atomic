using System;
using AtomicNet;

namespace AtomicNet
{

    public
    abstract
    partial     class   AtomicHandler   : Atom<AtomicHandler>
    {

        private     HostContext         context = null;

        protected   HostContext         Context     { get { return this.context; } }
        protected   HostRequest         Request     { get { return this.context.Request; } }
        protected   HostResponse        Response    { get { return this.context.Response; } }
        protected   HostServerUtility   Server      { get { return this.context.Server; } }

        internal    Promise             ProcessRequest(HostContext context)
        {
            this.SetContext(context);
            if (Atomic.IsStillBooting)  return  this.RespondWithEnvironmentTemporarilyUnavailable();

            return this.ProcessRequest();
        }

        private     void                SetContext(HostContext context)
        {
            Throw<ArgumentNullException>.If(context==null, "context");
            this.context    = context;
        }

        private     Promise             RespondWithEnvironmentTemporarilyUnavailable()
        {
            throw new NotImplementedException();
            return Promise.NoOp;
        }

        protected
        abstract    Promise             ProcessRequest();

    }

}
