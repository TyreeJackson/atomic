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

        [EditorBrowsable(EditorBrowsableState.Never)]
        public
        abstract
        partial class   EntityCriteria
        {

            protected   RequestUser     requestUser;

            protected
            abstract    tRouter         SetRequestUser<tRouter>(RequestUser requestUser) where tRouter : EntityCriteria.BehalfOfRouter;

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

        [EditorBrowsable(EditorBrowsableState.Never)]
        public
        partial class   EntityCriteria : Entity<tCriteria, tModification, tSelection>.EntityCriteria
        {

            public      tCreatedByCriteriaOps           CreatedBy           { get { throw new NotImplementedException(); } }
            public      tCreatedByIdCriteriaOps         CreatedById         { get { throw new NotImplementedException(); } }
            public      tCreationDateTimeCriteriaOps    CreationDateTime    { get { throw new NotImplementedException(); } }
            public      tIdCriteriaOps                  Id                  { get { throw new NotImplementedException(); } }
            public      tLastUpdatedByCriteriaOps       LastUpdatedBy       { get { throw new NotImplementedException(); } }
            public      tLastUpdatedByIdCriteriaOps     LastUpdatedById     { get { throw new NotImplementedException(); } }
            public      tLastUpdateDateTimeCriteriaOps  LastUdpateDateTime  { get { throw new NotImplementedException(); } }

            protected
            override    tRouter                         SetRequestUser<tRouter>(RequestUser requestUser)
            {
                this.requestUser    = requestUser;
                return hooks.createRouter<tRouter>((tCriteria) this);
            }

        }

    }

}
