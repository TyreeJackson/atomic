using AtomicNet;

namespace AtomicNet
{

    public
    abstract
    partial
    class       Component<tComponent, tComponentArgs, tComponentConfig> : Configurable<tComponent, tComponentArgs>
    where       tComponent                                              : Component<tComponent, tComponentArgs, tComponentConfig>
    where       tComponentConfig                                        : Component<tComponent, tComponentArgs, tComponentConfig>.BaseConfig
    {

        protected   Component(tComponentArgs args) : base(args) {}

    }

}
