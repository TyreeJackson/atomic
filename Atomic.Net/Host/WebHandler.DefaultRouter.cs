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

        public      class   DefaultRouter : Router
        {

            public      DefaultRouter(Args args) : base(args) {}

            public
            override    Promise<WebHandler> Map(string url)
            {
                return Atomic.Promise<WebHandler>
                ((resolve,reject)=>
                {
                    resolve(WebHandler.Create<WebHandler.Default>());
                });
            }
        }

    }

}
