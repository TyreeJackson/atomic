using NotImplementedException   = System.NotImplementedException;
using EditorBrowsableAttribute  = System.ComponentModel.EditorBrowsableAttribute;
using EditorBrowsableState      = System.ComponentModel.EditorBrowsableState;

namespace AtomicNet
{   partial class   Entity<tEntity, tCriteria, tModification, tSelection>
{

        [EditorBrowsable(EditorBrowsableState.Never)]
        public  class   ConjunctionRouter : Atom<ConjunctionRouter>
        {
                    
            private     tCriteria           criteria;

            internal                        ConjunctionRouter(tCriteria criteria)           { this.criteria = criteria; }

            public      tCriteria           And                                             { get { throw new NotImplementedException(); } }
            public      tCriteria           Or                                              { get { throw new NotImplementedException(); } }
            public      tSelection          Select                                          { get { throw new NotImplementedException(); } }
            public      tModification       Change                                          { get { throw new NotImplementedException(); } }

            public
            static
            implicit                        operator tCriteria (ConjunctionRouter router)   { return router == null ? null : router.criteria; }

        }

}}

namespace AtomicNet
{   partial class   Entity<tEntity, tHooks, tPrefetch, tProperties, tDataObject, tDataObjectList, tCriteria, tOrderBySelection, tModification, tSelection, tPropertySelection, tIndexSelection, tBusiness, tDataAccess, tLanguage, tCreatedByCriteriaOps, tCreatedByIdCriteriaOps, tCreationDateTimeCriteriaOps, tIdCriteriaOps, tLastUpdateDateTimeCriteriaOps, tLastUpdatedByCriteriaOps, tLastUpdatedByIdCriteriaOps>
{

    [EditorBrowsable(EditorBrowsableState.Never)]
    public  class   ConjunctionRouter : Entity<tEntity, tCriteria, tModification, tSelection>.ConjunctionRouter
    {
        internal                        ConjunctionRouter(tCriteria criteria) : base(criteria) {}
    }

}}
