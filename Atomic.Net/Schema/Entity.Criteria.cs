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

        [EditorBrowsable(EditorBrowsableState.Never)]
        public
        partial class   EntityCriteria : Atom<EntityCriteria>
        {

            protected   RequestUser     requestUser;

            protected   tRouter SetRequestUser<tRouter>(RequestUser requestUser) where tRouter : EntityCriteria.BehalfOfRouter
            {
                this.requestUser    = requestUser;
                return EntityCriteria.BehalfOfRouter.Create<tRouter, tCriteria>((tCriteria) this);
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

        [EditorBrowsable(EditorBrowsableState.Never)]
        public
        partial class   EntityCriteria : Entity<tCriteria, tModification, tSelection>.EntityCriteria
        {

            public  tCreatedByCriteriaOps           CreatedBy           { get { throw new NotImplementedException(); } }
            public  tCreatedByIdCriteriaOps         CreatedById         { get { throw new NotImplementedException(); } }
            public  tCreationDateTimeCriteriaOps    CreationDateTime    { get { throw new NotImplementedException(); } }
            public  tIdCriteriaOps                  Id                  { get { throw new NotImplementedException(); } }
            public  tLastUpdatedByCriteriaOps       LastUpdatedBy       { get { throw new NotImplementedException(); } }
            public  tLastUpdatedByIdCriteriaOps     LastUpdatedById     { get { throw new NotImplementedException(); } }
            public  tLastUpdateDateTimeCriteriaOps  LastUdpateDateTime  { get { throw new NotImplementedException(); } }

        }

    }

}
