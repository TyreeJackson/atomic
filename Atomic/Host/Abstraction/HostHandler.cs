using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AtomicStack
{

    public
    abstract    class   HostHandler : Atom<HostHandler>
    {

        public      void    ProcessRequest(HostContext context)
        {
            AtomicHandler.Router.Instance.Map(context.Request.Path).ProcessRequest(context);
        }

    }

}
