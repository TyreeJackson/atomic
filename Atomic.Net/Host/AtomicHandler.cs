using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AtomicNet
{

    public
    abstract
    partial     class   AtomicHandler : Atom<AtomicHandler>
    {

        private HostContext context = null;

        public  void        ProcessRequest(HostContext context)
        {
            this.context    = context;
            throw new NotImplementedException();
        }

    }

}
