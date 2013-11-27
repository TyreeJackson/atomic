using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AtomicNet
{

    public
    abstract    class   HostIdentity : Atom<HostIdentity>
    {

        public
        abstract    string  AuthenticationType  { get; }

        public
        abstract    bool    IsAuthenticated     { get; }

        public
        abstract    string  Name                { get; }

    }

}
