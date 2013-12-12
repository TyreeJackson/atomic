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

        public      class   DefaultRouter : Router
        {

            public      DefaultRouter(Args args) : base(args) {}

            public
            override    Promise<AtomicHandler> Map(string url)
            {
                return Atomic.Promise<AtomicHandler>
                ((resolve,reject)=>
                {
                    resolve(AtomicHandler.Create<AtomicHandler.Default>());
                });
            }
        }

    }

}
