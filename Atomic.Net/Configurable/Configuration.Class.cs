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
        class       ClassConfiguration
        {

            public
            readonly    SubclassConfiguration.List  Subclasses;

            protected   ClassConfiguration(SubclassConfiguration.List subclasses)   { this.Subclasses = subclasses; }

        }

    }

}
