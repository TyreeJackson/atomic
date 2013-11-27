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

            internal    static  Router  Instance;

            public  AtomicHandler   Map(string url)
            {
                throw new NotImplementedException();
            }

        }

    }

}
