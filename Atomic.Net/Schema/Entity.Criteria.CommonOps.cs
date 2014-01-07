using NotImplementedException   = System.NotImplementedException;
using EditorBrowsableAttribute  = System.ComponentModel.EditorBrowsableAttribute;
using EditorBrowsableState      = System.ComponentModel.EditorBrowsableState;

namespace AtomicNet
{

    public
    partial class   Entity
                    <
                        tCriteria,
                        tModification,
                        tSelection
                    >
    {

        public
        partial class   EntityCriteria
        {

            [EditorBrowsable(EditorBrowsableState.Never)]
            public
            partial class   CommonOps<t> : Atom<CommonOps<t>>
            {

                private     tCriteria   criteria;

                internal                CommonOps(tCriteria criteria)   { this.criteria = criteria; }

                public      IsEqualOp   IsEqual                         { get { return new IsEqualOp(this.criteria); } }

            }

        }

    }

}
