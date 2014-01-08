using DebuggerNonUserCodeAttribute  = System.Diagnostics.DebuggerNonUserCodeAttribute;
using NotImplementedException       = System.NotImplementedException;
using EditorBrowsableAttribute      = System.ComponentModel.EditorBrowsableAttribute;
using EditorBrowsableState          = System.ComponentModel.EditorBrowsableState;

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
        partial class   EntityLanguage : LanguageObject<EntityLanguage>
        {
        }

        [EditorBrowsable(EditorBrowsableState.Never)]
        public
        partial class   EntityLanguage
                        <
                            tBehalfOf,
                            tBehalfOfRouter
                        >
        :
                        EntityLanguage
                where   tBehalfOf       : EntityLanguage.EntityBehalfOf<tBehalfOfRouter>
                where   tBehalfOfRouter : EntityCriteria.BehalfOfRouter
        {
            [DebuggerNonUserCode()]
            public
            static  tBehalfOf           OnBehalfOf          { get { return EntityCriteria.BaseEntityBehalfOf.Create<tBehalfOf, tCriteria>(EntityCriteria.Create<tCriteria>()); } }

            [DebuggerNonUserCode()]
            public
            static  tOrderBySelection   OrderBy             { get { return EntityOrderBySelection.Create<tOrderBySelection>(); } }

            [DebuggerNonUserCode()]
            public
            static  tPropertySelection  SelectProperties    { get { return EntityPropertySelection.Create<tPropertySelection>(); } }

            [DebuggerNonUserCode()]
            public
            static  tCriteria           Where               { get { return EntityCriteria.Create<tCriteria>(); } }
        }

    }

}
