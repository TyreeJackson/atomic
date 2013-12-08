using AtomicNet;

namespace AtomicNet
{

    public
    abstract
    partial
    class       Component<tComponent, tComponentArgs, tComponentConfig>
    {

        public
        class       Config   : Configuration.Component<tComponentArgs>
        {
            public  Config(Configuration.SubclassConfiguration.List subclasses, string key, tComponentArgs args) : base(subclasses, key, args) {}
        }

    }

}
