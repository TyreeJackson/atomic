using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AtomicStack
{

    public  class   Atom
    {
    }

    public  class   Atom<tAtom, tSubAtom>
    :
                    Atom 
            where   tAtom           : Atom<tAtom, tSubAtom>
            where   tSubAtom        : tAtom
    {
        public  delegate    tSubAtom FactoryMethod();
    }

}
