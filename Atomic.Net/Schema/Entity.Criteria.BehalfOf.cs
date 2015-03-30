using NotImplementedException   = System.NotImplementedException;
using EditorBrowsableAttribute  = System.ComponentModel.EditorBrowsableAttribute;
using EditorBrowsableState      = System.ComponentModel.EditorBrowsableState;

namespace AtomicNet
{

    partial class   Entity
                    <
                        tCriteria,
                        tModification,
                        tSelection
                    >
    {

    partial class   EntityCriteria
    {

        [EditorBrowsable(EditorBrowsableState.Never)]
        public
        partial class   BaseEntityBehalfOf : Atom<BaseEntityBehalfOf>
        {
            protected   tCriteria       criteria;

            internal                    BaseEntityBehalfOf(tCriteria criteria)  { this.criteria = criteria; }
        }

        [EditorBrowsable(EditorBrowsableState.Never)]
        public
        partial class   EntityBehalfOf<tRouter> : BaseEntityBehalfOf
                where   tRouter                 : BehalfOfRouter
        {

            internal                EntityBehalfOf(tCriteria criteria) : base(criteria) { this.criteria = criteria; }

            public      tRouter     this[RequestUser requestUser]                       { get { return this.criteria.SetRequestUser<tRouter>(requestUser); } }

        }

    }

    }

    partial class   Entity
                    <
                        tEntity,
                        tHooks,
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

    partial class   EntityLanguage
    {

        [EditorBrowsable(EditorBrowsableState.Never)]
        public
        partial class   EntityBehalfOf<tRouter> : EntityCriteria.EntityBehalfOf<tRouter>
                where   tRouter                 : EntityCriteria.BehalfOfRouter
        {

            internal                EntityBehalfOf(tCriteria criteria) : base(criteria) {}

        }

    }

    }

}
