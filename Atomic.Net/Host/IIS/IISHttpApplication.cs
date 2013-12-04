using System;
using System.Web;
using AtomicNet;

namespace AtomicNet.IIS
{

    public  class IISHttpApplication : HostApplication
    {

        public override HostContext         Context
        {
            get
            {
                #warning NotImplemented
                throw new NotImplementedException();
            }
        }

        public override HostRequest         Request
        {
            get
            {
                #warning NotImplemented
                throw new NotImplementedException();
            }
        }

        public override HostResponse        Response
        {
            get
            {
                #warning NotImplemented
                throw new NotImplementedException();
            }
        }

        public override HostServerUtility   Server
        {
            get
            {
                #warning NotImplemented
                throw new NotImplementedException();
            }
        }

        public override HostPrincipal       User
        {
            get
            {
                #warning NotImplemented
                throw new NotImplementedException();
            }
        }

        public                              IISHttpApplication(HostContext context) : base(context) {}

    }

}
