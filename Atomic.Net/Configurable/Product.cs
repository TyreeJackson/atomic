using AtomicNet;

namespace AtomicNet
{

    public
    abstract
    partial
    class       Product<tProduct, tProductArgs> : Atom<tProduct, tProductArgs>
    where       tProduct                        : Product<tProduct, tProductArgs>
    {

        private
        readonly    tProductArgs    _args;

        protected   tProductArgs    args                        { get { return this._args; } }

        protected                   Product(tProductArgs args)
        :
                                    base(args)
        {
            this._args  = args;
        }

    }

}
