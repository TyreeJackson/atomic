using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AtomicNet
{

    public
    abstract    class   ServiceHandler : AtomicHandler
    {

        private     AtomicService   _service    = null;
        protected   AtomicService   service     { get { return this._service; } }

        protected   ServiceHandler(AtomicService service)  { Throw<ArgumentNullException>.If(service==null, "service");  this._service = service; }

    }

}
