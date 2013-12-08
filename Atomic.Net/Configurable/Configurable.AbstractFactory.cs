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

            protected
            abstract    tConfigurable    Create(tConfigurableArgs args);

        }

    }

}
