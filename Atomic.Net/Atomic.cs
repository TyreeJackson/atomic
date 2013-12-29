using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AtomicNet;

public class Atomic<tAtomic> : Atom<tAtomic> where tAtomic : Atomic<tAtomic>
{

    internal
    static      bool    IsPreloading    { get { return Loader.IsPreloading; } }

    static              Atomic()
    {
    }

    internal static void Boot() { /* Do nothing.  The static constructor will take care of everything. */ }

}

public class Atomic : Atomic<Atomic>
{

    public  static  bool            IsStillBooting                                          { get; private set; }

    public  static  Promise         Promise(Action<Action, Action<Exception>> action)       { return AtomicNet.Promise.Create(action); }
    public  static  Promise<t>      Promise<t>(Action<Action<t>, Action<Exception>> action) { return AtomicNet.Promise<t>.Create(action); }

}