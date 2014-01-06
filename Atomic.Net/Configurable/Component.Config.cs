using AtomicNet;

namespace AtomicNet
{

    public
    abstract
    partial
    class       Component<tComponent, tComponentArgs, tComponentConfig>
    {

        public
        class       BaseConfig   : Configuration.Component<tComponentArgs>
        {
            public  BaseConfig(Configuration.SubclassConfiguration.List subclasses, string key, tComponentArgs args) : base(subclasses, key, args) {}
        }

    }

}
