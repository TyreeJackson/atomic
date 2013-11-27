using System;
using System.Web;
using AtomicNet;

namespace AtomicNet.IIS
{

    public  class IISHttpApplication : HostApplication
    {

        public override HostContext Context
        {
            get
            {
                throw new NotImplementedException();
            }
        }

        public override HostRequest Request
        {
            get
            {
                throw new NotImplementedException();
            }
        }

        public override HostResponse Response
        {
            get
            {
                throw new NotImplementedException();
            }
        }

        public override HostServerUtility Server
        {
            get
            {
                throw new NotImplementedException();
            }
        }

        public override HostPrincipal User
        {
            get
            {
                throw new NotImplementedException();
            }
        }
    }

}
