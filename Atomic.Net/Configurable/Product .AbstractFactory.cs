using AtomicNet;

namespace AtomicNet
{

    public
    abstract
    partial
    class       Product<tProduct, tProductArgs> : Atom<tProduct, tProductArgs>
    where       tProduct                        : Product<tProduct, tProductArgs>
    {

        public
        abstract
        partial
        class      AbstractFactory
        {

            protected
            abstract    tProduct    Create(tProductArgs args);

        }

    }

}
