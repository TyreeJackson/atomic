using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AtomicNet
{

    public
    abstract    class   WebServiceHandler : WebHandler
    {

        private     WebService   _service    = null;
        protected   WebService   service     { get { return this._service; } }

        protected   WebServiceHandler(WebService service)   { Throw<ArgumentNullException>.If(service==null, "service");  this._service = service; }

    }

}
