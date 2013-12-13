using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AtomicNet
{

    public
    abstract    class   HostApplication : Atom<HostApplication, HostContext>
    {

        public  HostApplication(HostContext context) : base(context) {}

    }

}
