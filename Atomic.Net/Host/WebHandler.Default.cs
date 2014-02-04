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

        public  class   Default : WebHandler
        {

            protected
            override
            async       Task    ProcessRequest()
            {
                this.Response.Write("You have reached the default handler.");
            }

        }

    }

}
