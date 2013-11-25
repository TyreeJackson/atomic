using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AtomicStack
{

    public
    abstract    class   HostPrincipal : Atom<HostPrincipal>
    {

        public
        abstract    HostIdentity    Identity                { get; }

        public
        abstract    bool            IsInRole(string role);

    }

}
