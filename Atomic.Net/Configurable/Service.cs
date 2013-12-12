using AtomicNet;

namespace AtomicNet
{

    public
    abstract
    partial
    class       Service<tService, tServiceArgs> : Configurable<tService, tServiceArgs>
    where       tService                        : Service<tService, tServiceArgs>
    {

        protected   Service(tServiceArgs args) : base(args) {}

    }

}
