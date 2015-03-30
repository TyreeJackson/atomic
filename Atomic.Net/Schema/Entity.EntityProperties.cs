using NotImplementedException   = System.NotImplementedException;
using EditorBrowsableAttribute  = System.ComponentModel.EditorBrowsableAttribute;
using EditorBrowsableState      = System.ComponentModel.EditorBrowsableState;

namespace AtomicNet
{

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

        [EditorBrowsable(EditorBrowsableState.Never)]
        public
        partial class   EntityProperties : Atom<EntityProperties>
        {

            public  class   CreatedBy
            {
                public  class   Ops : EntityCriteria.RelatedOps<User.Criteria>
                {
                    public  Ops(tCriteria criteria) : base(criteria) {}
                }
            }

            public  class   CreatedById
            {
                public  class   Ops : EntityCriteria.CommonOps<System.Guid>
                {
                    public  Ops(tCriteria criteria) : base(criteria) {}
                }
            }

            public  class   CreationDateTime
            {
                public  class   Ops : EntityCriteria.CommonOps<DateTimeOffset>
                {
                    public  Ops(tCriteria criteria) : base(criteria) {}
                }
            }

            public  class   Id
            {
                public  class   Ops : EntityCriteria.CommonOps<System.Guid>
                {
                    public  Ops(tCriteria criteria) : base(criteria) {}
                }
            }

            public  class   LastUpdatedBy
            {
                public  class   Ops : EntityCriteria.RelatedOps<User.Criteria>
                {
                    public  Ops(tCriteria criteria) : base(criteria) {}
                }
            }

            public  class   LastUpdatedById
            {
                public  class   Ops : EntityCriteria.CommonOps<System.Guid>
                {
                    public  Ops(tCriteria criteria) : base(criteria) {}
                }
            }

            public  class   LastUpdateDateTime
            {
                public  class   Ops : EntityCriteria.CommonOps<DateTimeOffset>
                {
                    public  Ops(tCriteria criteria) : base(criteria) {}
                }
            }

        }

    }

}
