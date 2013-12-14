using AtomicNet;

namespace AtomicNet
{

    public
    abstract
    partial
    class       Service<tService, tServiceArgs>
    {

        public
        class       Config   : Configuration.Service
        {
            public  Config(Configuration.SubclassConfiguration.List subclasses, Configuration.InstanceConfiguration.List instances) : base(subclasses, instances) {}
        }

    }

}
