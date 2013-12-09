using AtomicNet;

namespace AtomicNet
{

    public
    abstract
    partial
    class       Configurable<tConfigurable, tConfigurableArgs>
    {

        public
        abstract
        partial
        class      AbstractFactory
        {

            public
            class   StandardSubclasses   : StringEnum<StandardSubclasses>
            {

                protected   StandardSubclasses(string subclassName) : base(subclassName) {}

            }

        }

    }

}
