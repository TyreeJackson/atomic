﻿using EditorBrowsableAttribute  = System.ComponentModel.EditorBrowsableAttribute;
using EditorBrowsableState      = System.ComponentModel.EditorBrowsableState;

namespace AtomicNet
{   partial class   Entity<tEntity, tHooks, tPrefetch, tProperties, tDataObject, tDataObjectList, tCriteria, tOrderBySelection, tModification, tSelection, tPropertySelection, tIndexSelection, tBusiness, tDataAccess, tLanguage, tCreatedByCriteriaOps, tCreatedByIdCriteriaOps, tCreationDateTimeCriteriaOps, tIdCriteriaOps, tLastUpdateDateTimeCriteriaOps, tLastUpdatedByCriteriaOps, tLastUpdatedByIdCriteriaOps>
{

    [EditorBrowsable(EditorBrowsableState.Never)]
    public
    partial class   EntityPrefetch : Atom<EntityPrefetch>
    {

        public  Entities.User.DataObjectList    CreatedBy;
        public  Entities.User.DataObjectList    LastUpdatedBy;

    }

}}