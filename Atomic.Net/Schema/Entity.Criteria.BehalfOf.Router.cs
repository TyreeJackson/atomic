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
            public  class   BehalfOfRouter : Atom<BehalfOfRouter, tCriteria>
            {

                private tCriteria   criteria;

                internal            BehalfOfRouter(tCriteria criteria) : base(criteria) { this.criteria = criteria; }

                public  tCriteria   Where                                               { get { return this.criteria; } }

            }

        }

    }

}
