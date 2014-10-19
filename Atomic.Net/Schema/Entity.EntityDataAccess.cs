﻿using NotImplementedException   = System.NotImplementedException;
using EditorBrowsableAttribute  = System.ComponentModel.EditorBrowsableAttribute;
using EditorBrowsableState      = System.ComponentModel.EditorBrowsableState;

namespace AtomicNet
{

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
        partial class   EntityDataAccess : Atom<EntityDataAccess>
        {

            protected   tBusiness   business                    { get; private set; }

            public                  EntityDataAccess() : this(EntityBusiness.Create<tBusiness>(), SqlBuilder.Create()) {}

            protected
            internal                EntityDataAccess
                                    (
                                        tBusiness   business,
                                        SqlBuilder  sqlBuilder
                                    )
            {
                this.business   = business;
            }

            public  tDataObjectList Load(tSelection selection)
            {
                throw new NotImplementedException();
            }

        }

    }

}
