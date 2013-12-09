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
        class       Component<tComponentArgs> : ClassConfiguration
        {
            public      string          SubclassKey;
            public      tComponentArgs  args;

            protected   Component(SubclassConfiguration.List subclasses, string subclassKey, tComponentArgs args) : base(subclasses)
            {
                this.SubclassKey    = subclassKey;
                this.args           = args;
            }
        }

    }

}
