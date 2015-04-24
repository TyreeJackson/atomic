using DebuggerNonUserCodeAttribute  = System.Diagnostics.DebuggerNonUserCodeAttribute;
using EditorBrowsableAttribute      = System.ComponentModel.EditorBrowsableAttribute;
using EditorBrowsableState          = System.ComponentModel.EditorBrowsableState;

namespace AtomicNet
{   partial class   Entity<tEntity, tHooks, tPrefetch, tProperties, tDataObject, tDataObjectList, tCriteria, tOrderBySelection, tModification, tSelection, tPropertySelection, tIndexSelection, tBusiness, tDataAccess, tLanguage, tCreatedByCriteriaOps, tCreatedByIdCriteriaOps, tCreationDateTimeCriteriaOps, tIdCriteriaOps, tLastUpdateDateTimeCriteriaOps, tLastUpdatedByCriteriaOps, tLastUpdatedByIdCriteriaOps>
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
        static  tBehalfOf           OnBehalfOf          { get { return hooks.createBehalfOf<tBehalfOf, tBehalfOfRouter>(hooks.createCriteria()); } }

        [DebuggerNonUserCode()]
        public
        static  tOrderBySelection   OrderBy             { get { return hooks.createOrderBySelection(); } }

        [DebuggerNonUserCode()]
        public
        static  tPropertySelection  SelectProperties    { get { return hooks.createPropertySelection(); } }

        [DebuggerNonUserCode()]
        public
        static  tCriteria           Where               { get { return hooks.createCriteria(); } }

    }

}}
