using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AtomicNet;

public class Atomic<tAtomic> : Atom<Atomic<tAtomic>, tAtomic> where tAtomic : Atomic<tAtomic>
{

    static  Atomic()
    {
    }

    internal static void Boot(bool preloading)  { /* Do nothing.  The static constructor will take care of everything. */ }

}

public class Atomic : Atomic<Atomic>
{

}