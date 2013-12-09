using AtomicNet;

namespace AtomicNet
{

    public
    abstract
    partial
    class       Utility<tUtility, tUtilityArgs> : Configurable<tUtility, tUtilityArgs>
    where       tUtility                        : Utility<tUtility, tUtilityArgs>
    {

        protected   Utility(tUtilityArgs args) : base(args) {}

    }

}
