using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AtomicNet
{

    public
    abstract
    partial     class   WebServiceHandler
    {

        public  class   ServiceList : WebHandler
        {

            protected override Promise ProcessRequest()
            {
                return Atomic.Promise
                ((resolve, reject)=>
                {
                    this.Response.Write("The Web Services Listing will go here.");
                    resolve();
                });
            }

        }

    }

}
