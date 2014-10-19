using DebuggerNonUserCodeAttribute  = System.Diagnostics.DebuggerNonUserCodeAttribute;
using NotImplementedException       = System.NotImplementedException;
using EditorBrowsableAttribute      = System.ComponentModel.EditorBrowsableAttribute;
using EditorBrowsableState          = System.ComponentModel.EditorBrowsableState;
using AtomicNet;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace AtomicNetTests
{

    public
    partial class   EntityTests
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

        [TestClass]
        public
        partial class   EntityLanguageTests
        {
        }

        [TestClass]
        public
        partial class   EntityLanguageTests
                        <
                            tBehalfOf,
                            tBehalfOfRouter
                        >
        :
                        EntityLanguageTests
                where   tBehalfOf       : Entity<tEntity, tPrefetch, tProperties, tDataObject, tDataObjectList, tCriteria, tOrderBySelection, tModification, tSelection, tPropertySelection, tIndexSelection, tBusiness, tDataAccess, tLanguage, tCreatedByCriteriaOps, tCreatedByIdCriteriaOps, tCreationDateTimeCriteriaOps, tIdCriteriaOps, tLastUpdateDateTimeCriteriaOps, tLastUpdatedByCriteriaOps, tLastUpdatedByIdCriteriaOps>.EntityLanguage.EntityBehalfOf<tBehalfOfRouter>
                where   tBehalfOfRouter : Entity<tEntity, tPrefetch, tProperties, tDataObject, tDataObjectList, tCriteria, tOrderBySelection, tModification, tSelection, tPropertySelection, tIndexSelection, tBusiness, tDataAccess, tLanguage, tCreatedByCriteriaOps, tCreatedByIdCriteriaOps, tCreationDateTimeCriteriaOps, tIdCriteriaOps, tLastUpdateDateTimeCriteriaOps, tLastUpdatedByCriteriaOps, tLastUpdatedByIdCriteriaOps>.EntityCriteria.BehalfOfRouter
        {
        }

    }

}
