using NotImplementedException   = System.NotImplementedException;
using EditorBrowsableAttribute  = System.ComponentModel.EditorBrowsableAttribute;
using EditorBrowsableState      = System.ComponentModel.EditorBrowsableState;
using AtomicNet;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace AtomicNetTests
{

    public
    partial class   EntityTests
                    <
                        tCriteria,
                        tModification,
                        tSelection
                    >
    {

        public
        partial class   EntityCriteriaTests
        {

            [TestClass]
            public
            partial class   BaseEntityBehalfOfTests
            {
            }

            [TestClass]
            public
            partial class   EntityBehalfOfTests<tRouter>
                    where   tRouter : Entity<tCriteria, tModification, tSelection>.EntityCriteria.BehalfOfRouter
            {
            }

        }

    }

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

        public
        partial class   EntityLanguageTests
        {

        [TestClass]
        public
        partial class   EntityBehalfOfTests<tRouter> : EntityCriteriaTests.EntityBehalfOfTests<tRouter>
                where   tRouter : Entity<tEntity, tPrefetch, tProperties, tDataObject, tDataObjectList, tCriteria, tOrderBySelection, tModification, tSelection, tPropertySelection, tIndexSelection, tBusiness, tDataAccess, tLanguage, tCreatedByCriteriaOps, tCreatedByIdCriteriaOps, tCreationDateTimeCriteriaOps, tIdCriteriaOps, tLastUpdateDateTimeCriteriaOps, tLastUpdatedByCriteriaOps, tLastUpdatedByIdCriteriaOps>.EntityCriteria.BehalfOfRouter
        {
        }

        }

    }

}
