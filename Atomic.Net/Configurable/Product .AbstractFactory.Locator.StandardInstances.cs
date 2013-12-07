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

            public
            class   StandardInstances   : StringEnum<StandardInstances>
            {

                protected   StandardInstances(string instanceName) : base(instanceName) {}

            }

        }

    }

}
