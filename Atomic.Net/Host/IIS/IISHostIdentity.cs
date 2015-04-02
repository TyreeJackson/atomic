using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Security.Principal;

namespace AtomicNet
{

    public  class   IISHostIdentity : HostIdentity
    {

        private     IIdentity   identity;

        public                  IISHostIdentity(IIdentity identity) { this.identity = identity; }

        public
        override    string      AuthenticationType                  { get { return this.identity.AuthenticationType; } }

        public
        override    bool        IsAuthenticated                     { get { return this.identity.IsAuthenticated; } }

        public
        override    string      Name                                { get { return this.identity.Name; } }
    }

}
