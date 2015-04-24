using NotImplementedException   = System.NotImplementedException;
using EditorBrowsableAttribute  = System.ComponentModel.EditorBrowsableAttribute;
using EditorBrowsableState      = System.ComponentModel.EditorBrowsableState;

namespace AtomicNet
{

    [EditorBrowsable(EditorBrowsableState.Never)]
    public  delegate    tRelatedCriteria    RelatedCriteriaQuery<tRelatedCriteria>(tRelatedCriteria relatedCriteria);

}

namespace AtomicNet
{   partial class   Entity<tEntity, tCriteria, tModification, tSelection>
{

    partial class   EntityCriteria
    {

        [EditorBrowsable(EditorBrowsableState.Never)]
        public
        partial class   RelatedOps<tRelatedCriteria> : Atom<RelatedOps<tRelatedCriteria>>
        {

            private     tCriteria           criteria;

            internal                        RelatedOps(tCriteria criteria)              { this.criteria = criteria; }

            public      ConjunctionRouter   this
                                            [
                                                RelatedCriteriaQuery
                                                <
                                                    tRelatedCriteria
                                                >                       relatedCriteria
                                            ]                                           { get { throw new NotImplementedException (); } }

        }

    }

}}
