using DebuggerNonUserCodeAttribute  = System.Diagnostics.DebuggerNonUserCodeAttribute;
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
                        tDataAccess
                    >
    {

        public
        partial class   Language : LanguageObject<Language>
        {
            [DebuggerNonUserCode()]
            public
            static  EntityCriteria.BehalfOf OnBehalfOf          { get { return new EntityCriteria.BehalfOf(EntityCriteria.Create<tCriteria>()); } }

            [DebuggerNonUserCode()]
            public
            static  tOrderBySelection       OrderBy             { get { return EntityOrderBySelection.Create<tOrderBySelection>(); } }

            [DebuggerNonUserCode()]
            public
            static  tPropertySelection      SelectProperties    { get { return EntityPropertySelection.Create<tPropertySelection>(); } }

            [DebuggerNonUserCode()]
            public
            static  tCriteria               Where               { get { return EntityCriteria.Create<tCriteria>(); } }
        }

    }

}
