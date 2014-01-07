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

            public
            partial class   CommonOps<t>
            {

                [EditorBrowsable(EditorBrowsableState.Never)]
                public  class   IsEqualOp : Atom<IsEqualOp>
                {
                    
                    private     tCriteria           criteria;

                    internal                        IsEqualOp(tCriteria criteria)   { this.criteria = criteria; }

                    public      ConjunctionRouter   this[t value]                   { get { throw new NotImplementedException(); } }

                }

            }

        }

    }

}
