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
            partial class   EntityBehalfOf : Atom<EntityBehalfOf, tCriteria>
            {
                protected   tCriteria       criteria;

                internal                    EntityBehalfOf(tCriteria criteria) : base(criteria) { this.criteria = criteria; }
            }

            [EditorBrowsable(EditorBrowsableState.Never)]
            public
            partial class   EntityBehalfOf<tRouter> : EntityBehalfOf
                    where   tRouter : BehalfOfRouter
            {

                internal                EntityBehalfOf(tCriteria criteria) : base(criteria) { this.criteria = criteria; }

                public      tRouter     this[RequestUser requestUser]                       { get { return this.criteria.SetRequestUser<tRouter>(requestUser); } }

            }

        }

    }

    public
    partial class   Entity
                    <
                        tEntity,
                        tPrefetch,
                        tProperties,
                        tDataObject,
                        tDataObjectList,
                        tCriteria,
                        tOrderBySelection,
                        tModification,
                        tSelection,
                        tPropertySelection,
                        tIndexSelection,
                        tBusiness,
                        tDataAccess,
                        tLanguage,
                        tCreatedByCriteriaOps,
                        tCreatedByIdCriteriaOps,
                        tCreationDateTimeCriteriaOps,
                        tIdCriteriaOps,
                        tLastUpdateDateTimeCriteriaOps,
                        tLastUpdatedByCriteriaOps,
                        tLastUpdatedByIdCriteriaOps
                    >
    {

        public
        partial class   EntityLanguage
        {

        [EditorBrowsable(EditorBrowsableState.Never)]
        public
        partial class   EntityBehalfOf<tRouter> : EntityCriteria.EntityBehalfOf<tRouter>
                where   tRouter : EntityCriteria.BehalfOfRouter
        {

            internal                EntityBehalfOf(tCriteria criteria) : base(criteria) {}

        }

        }

    }

}
