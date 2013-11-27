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

    public  static  bool            IsStillBooting  { get; private set; }

    public  static  Promise         Promise(Action<Action, Action<Exception>> action)                   { return AtomicNet.Promise.FactoryLocator.Create(action); }
    public  static  Promise<t>      Promise<t>(Action<Action<t>, Action<Exception>> action)             { return AtomicNet.Promise<t>.FactoryLocator.Create(action); }
    public  static  Promise<t1, t2> Promise<t1, t2>(Action<Action<t1, t2>, Action<Exception>> action)   { return AtomicNet.Promise<t1, t2>.FactoryLocator.Create(action); }

}