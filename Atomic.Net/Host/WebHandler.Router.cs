using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AtomicNet
{

    public
    abstract
    partial     class   WebHandler : Atom<WebHandler>
    {

        public
        abstract
        partial     class   Router : Atom<Router>
        {

            public
            abstract    Task<WebHandler>    Map(HostContext context);

        }

    }

}
