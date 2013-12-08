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
        class       Factory<tFactory, tSubProduct>
        :
                    AbstractFactory
        where       tFactory            : Factory<tFactory, tSubProduct>
        where       tSubProduct         : tConfigurable
        {

            protected
            override    tConfigurable    Create(tConfigurableArgs args)   { return Configurable<tConfigurable, tConfigurableArgs>.Create<tSubProduct>(args); }

        }

    }

}
