using System;

namespace AtomicNet
{

    public  class   Throw<tException>
    :
                    Atom<Throw<tException>>
            where   tException  : Exception
    {

        public
        sealed
        class   Or : Atom<Or>
        {

            public
            static
            readonly    Or  Empty   = new Or();

            public      Or  OrIf(bool condition)                    { if (condition)    throw TypeSupport<tException>.Create(); return Or.Empty;}

            public      Or  OrIf<tArg>(bool condition, tArg arg)    { if (condition)    throw TypeSupport<tException>.Create(arg); return Or.Empty;}

        }

        public
        static  Or  If(bool condition)                  { if (condition)    throw TypeSupport<tException>.Create();  return Or.Empty;}

        public
        static  Or  If<tArg>(bool condition, tArg arg)  { if (condition)    throw TypeSupport<tException>.Create(arg);  return Or.Empty;}

    }

}
