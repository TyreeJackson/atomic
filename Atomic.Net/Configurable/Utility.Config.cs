using AtomicNet;

namespace AtomicNet
{

    public
    abstract
    partial
    class       Utility<tUtility, tUtilityArgs>
    {

        public
        class       Config   : Configuration.Utility
        {
            public  Config(Configuration.SubclassConfiguration.List subclasses, Configuration.InstanceConfiguration.List instances) : base(subclasses, instances) {}
        }

    }

}
