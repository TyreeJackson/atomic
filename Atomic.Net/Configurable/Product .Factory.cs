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
        class       Factory<tFactory, tSubProduct>
        :
                    AbstractFactory
        where       tFactory            : Factory<tFactory, tSubProduct>
        where       tSubProduct         : tProduct
        {

            protected
            override    tProduct    Create(tProductArgs args)   { return Product<tProduct, tProductArgs>.Create<tSubProduct>(args); }

        }

    }

}
