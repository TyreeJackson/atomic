using AtomicNet;

namespace AtomicNet
{

    public
    abstract
    partial
    class       Configurable<tConfigurable, tConfigurableArgs>  : Atom<tConfigurable, tConfigurableArgs>
    where       tConfigurable                                   : Configurable<tConfigurable, tConfigurableArgs>
    {

        private
        readonly    tConfigurableArgs   _args;

        protected   tConfigurableArgs   args                                { get { return this._args; } }

        protected                       Configurable(tConfigurableArgs args)
        :
                                        base(args)
        {
            this._args  = args;
        }

    }

}
