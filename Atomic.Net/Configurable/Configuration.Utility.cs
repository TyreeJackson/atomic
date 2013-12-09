using AtomicNet;

namespace AtomicNet
{

    public
    abstract
    partial
    class       Configuration
    {

        public
        abstract
        class       Utility : ClassConfiguration
        {

            public
            readonly    InstanceConfiguration.List  Instances;

            protected   Utility(SubclassConfiguration.List subclasses, InstanceConfiguration.List instances) : base(subclasses)
            {
                this.Instances  = instances;
            }
        }

    }

}
