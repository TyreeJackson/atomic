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
        class       Service : ClassConfiguration
        {

            public
            readonly    InstanceConfiguration.List  Instances;

            protected   Service(SubclassConfiguration.List subclasses, InstanceConfiguration.List instances) : base(subclasses)
            {
                this.Instances  = instances;
            }
        }

    }

}
