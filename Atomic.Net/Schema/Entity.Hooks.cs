using NotImplementedException = System.NotImplementedException;
using EditorBrowsableAttribute = System.ComponentModel.EditorBrowsableAttribute;
using EditorBrowsableState = System.ComponentModel.EditorBrowsableState;
using System;

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
        abstract
        partial     class EntityHooks : LanguageObject<tHooks>
        {
            public  abstract    tCriteria                       createCriteria();

            public  abstract    tPropertySelection              createPropertySelection();

            public  abstract    tOrderBySelection               createOrderBySelection();

            public  abstract    tRouter                         createRouter<tRouter>(tCriteria criteria) where tRouter : EntityCriteria.BehalfOfRouter;

            public  abstract    tBehalfOf                       createBehalfOf<tBehalfOf, tBehalfOfRouter>(tCriteria tCriteria) where tBehalfOf : EntityLanguage.EntityBehalfOf<tBehalfOfRouter> where tBehalfOfRouter : EntityCriteria.BehalfOfRouter;

        }

    }

}
