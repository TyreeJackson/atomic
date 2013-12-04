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

        public
        abstract    class   Router : Atom<Router>
        {

            internal
            static      Router                  Instance;

            public
            abstract    Promise<AtomicHandler>  Map(string url);

        }

        public      class   DefaultRouter : Router
        {
            public override Promise<AtomicHandler> Map(string url)
            {
                return Atomic.Promise<AtomicHandler>
                ((resolve,reject)=>
                {
                    reject(new NotImplementedException());
                });
            }
        }

    }

}
