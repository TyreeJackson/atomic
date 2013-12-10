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

        public  class   Default : AtomicHandler
        {

            protected override Promise ProcessRequest()
            {
                return Atomic.Promise
                ((resolve, reject)=>
                {
                    this.Response.Write("You have reached the default handler.");
                    resolve();
                });
            }

        }

    }

}
