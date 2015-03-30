using NotImplementedException   = System.NotImplementedException;
using EditorBrowsableAttribute  = System.ComponentModel.EditorBrowsableAttribute;
using EditorBrowsableState      = System.ComponentModel.EditorBrowsableState;

namespace AtomicNet
{

    [EditorBrowsable(EditorBrowsableState.Never)]
    public
    partial class   Entity : LanguageObject<Entity>
    {
    }

    [EditorBrowsable(EditorBrowsableState.Never)]
    public
    partial class   Entity
                    <
                        tCriteria,
                        tModification,
                        tSelection
                    >
            where   tCriteria   : Entity<tCriteria, tModification, tSelection>.EntityCriteria
    {
    }

    [EditorBrowsable(EditorBrowsableState.Never)]
    public
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
    :
                    Entity<tCriteria, tModification, tSelection>
            where   tEntity                         : Entity<tEntity, tHooks, tPrefetch, tProperties, tDataObject, tDataObjectList, tCriteria, tOrderBySelection, tModification, tSelection, tPropertySelection, tIndexSelection, tBusiness, tDataAccess, tLanguage, tCreatedByCriteriaOps, tCreatedByIdCriteriaOps, tCreationDateTimeCriteriaOps, tIdCriteriaOps, tLastUpdateDateTimeCriteriaOps, tLastUpdatedByCriteriaOps, tLastUpdatedByIdCriteriaOps>
            where   tHooks                          : Entity<tEntity, tHooks, tPrefetch, tProperties, tDataObject, tDataObjectList, tCriteria, tOrderBySelection, tModification, tSelection, tPropertySelection, tIndexSelection, tBusiness, tDataAccess, tLanguage, tCreatedByCriteriaOps, tCreatedByIdCriteriaOps, tCreationDateTimeCriteriaOps, tIdCriteriaOps, tLastUpdateDateTimeCriteriaOps, tLastUpdatedByCriteriaOps, tLastUpdatedByIdCriteriaOps>.EntityHooks, new()
            where   tPrefetch                       : Entity<tEntity, tHooks, tPrefetch, tProperties, tDataObject, tDataObjectList, tCriteria, tOrderBySelection, tModification, tSelection, tPropertySelection, tIndexSelection, tBusiness, tDataAccess, tLanguage, tCreatedByCriteriaOps, tCreatedByIdCriteriaOps, tCreationDateTimeCriteriaOps, tIdCriteriaOps, tLastUpdateDateTimeCriteriaOps, tLastUpdatedByCriteriaOps, tLastUpdatedByIdCriteriaOps>.EntityPrefetch
            where   tProperties                     : Entity<tEntity, tHooks, tPrefetch, tProperties, tDataObject, tDataObjectList, tCriteria, tOrderBySelection, tModification, tSelection, tPropertySelection, tIndexSelection, tBusiness, tDataAccess, tLanguage, tCreatedByCriteriaOps, tCreatedByIdCriteriaOps, tCreationDateTimeCriteriaOps, tIdCriteriaOps, tLastUpdateDateTimeCriteriaOps, tLastUpdatedByCriteriaOps, tLastUpdatedByIdCriteriaOps>.EntityProperties
            where   tDataObject                     : Entity<tEntity, tHooks, tPrefetch, tProperties, tDataObject, tDataObjectList, tCriteria, tOrderBySelection, tModification, tSelection, tPropertySelection, tIndexSelection, tBusiness, tDataAccess, tLanguage, tCreatedByCriteriaOps, tCreatedByIdCriteriaOps, tCreationDateTimeCriteriaOps, tIdCriteriaOps, tLastUpdateDateTimeCriteriaOps, tLastUpdatedByCriteriaOps, tLastUpdatedByIdCriteriaOps>.EntityDataObject
            where   tDataObjectList                 : Entity<tEntity, tHooks, tPrefetch, tProperties, tDataObject, tDataObjectList, tCriteria, tOrderBySelection, tModification, tSelection, tPropertySelection, tIndexSelection, tBusiness, tDataAccess, tLanguage, tCreatedByCriteriaOps, tCreatedByIdCriteriaOps, tCreationDateTimeCriteriaOps, tIdCriteriaOps, tLastUpdateDateTimeCriteriaOps, tLastUpdatedByCriteriaOps, tLastUpdatedByIdCriteriaOps>.EntityDataObjectList
            where   tCriteria                       : Entity<tEntity, tHooks, tPrefetch, tProperties, tDataObject, tDataObjectList, tCriteria, tOrderBySelection, tModification, tSelection, tPropertySelection, tIndexSelection, tBusiness, tDataAccess, tLanguage, tCreatedByCriteriaOps, tCreatedByIdCriteriaOps, tCreationDateTimeCriteriaOps, tIdCriteriaOps, tLastUpdateDateTimeCriteriaOps, tLastUpdatedByCriteriaOps, tLastUpdatedByIdCriteriaOps>.EntityCriteria
            where   tOrderBySelection               : Entity<tEntity, tHooks, tPrefetch, tProperties, tDataObject, tDataObjectList, tCriteria, tOrderBySelection, tModification, tSelection, tPropertySelection, tIndexSelection, tBusiness, tDataAccess, tLanguage, tCreatedByCriteriaOps, tCreatedByIdCriteriaOps, tCreationDateTimeCriteriaOps, tIdCriteriaOps, tLastUpdateDateTimeCriteriaOps, tLastUpdatedByCriteriaOps, tLastUpdatedByIdCriteriaOps>.EntityOrderBySelection
            where   tModification                   : Entity<tEntity, tHooks, tPrefetch, tProperties, tDataObject, tDataObjectList, tCriteria, tOrderBySelection, tModification, tSelection, tPropertySelection, tIndexSelection, tBusiness, tDataAccess, tLanguage, tCreatedByCriteriaOps, tCreatedByIdCriteriaOps, tCreationDateTimeCriteriaOps, tIdCriteriaOps, tLastUpdateDateTimeCriteriaOps, tLastUpdatedByCriteriaOps, tLastUpdatedByIdCriteriaOps>.EntityModification
            where   tSelection                      : Entity<tEntity, tHooks, tPrefetch, tProperties, tDataObject, tDataObjectList, tCriteria, tOrderBySelection, tModification, tSelection, tPropertySelection, tIndexSelection, tBusiness, tDataAccess, tLanguage, tCreatedByCriteriaOps, tCreatedByIdCriteriaOps, tCreationDateTimeCriteriaOps, tIdCriteriaOps, tLastUpdateDateTimeCriteriaOps, tLastUpdatedByCriteriaOps, tLastUpdatedByIdCriteriaOps>.EntitySelection
            where   tPropertySelection              : Entity<tEntity, tHooks, tPrefetch, tProperties, tDataObject, tDataObjectList, tCriteria, tOrderBySelection, tModification, tSelection, tPropertySelection, tIndexSelection, tBusiness, tDataAccess, tLanguage, tCreatedByCriteriaOps, tCreatedByIdCriteriaOps, tCreationDateTimeCriteriaOps, tIdCriteriaOps, tLastUpdateDateTimeCriteriaOps, tLastUpdatedByCriteriaOps, tLastUpdatedByIdCriteriaOps>.EntityPropertySelection
            where   tIndexSelection                 : Entity<tEntity, tHooks, tPrefetch, tProperties, tDataObject, tDataObjectList, tCriteria, tOrderBySelection, tModification, tSelection, tPropertySelection, tIndexSelection, tBusiness, tDataAccess, tLanguage, tCreatedByCriteriaOps, tCreatedByIdCriteriaOps, tCreationDateTimeCriteriaOps, tIdCriteriaOps, tLastUpdateDateTimeCriteriaOps, tLastUpdatedByCriteriaOps, tLastUpdatedByIdCriteriaOps>.EntityIndexSelection
            where   tBusiness                       : Entity<tEntity, tHooks, tPrefetch, tProperties, tDataObject, tDataObjectList, tCriteria, tOrderBySelection, tModification, tSelection, tPropertySelection, tIndexSelection, tBusiness, tDataAccess, tLanguage, tCreatedByCriteriaOps, tCreatedByIdCriteriaOps, tCreationDateTimeCriteriaOps, tIdCriteriaOps, tLastUpdateDateTimeCriteriaOps, tLastUpdatedByCriteriaOps, tLastUpdatedByIdCriteriaOps>.EntityBusiness
            where   tDataAccess                     : Entity<tEntity, tHooks, tPrefetch, tProperties, tDataObject, tDataObjectList, tCriteria, tOrderBySelection, tModification, tSelection, tPropertySelection, tIndexSelection, tBusiness, tDataAccess, tLanguage, tCreatedByCriteriaOps, tCreatedByIdCriteriaOps, tCreationDateTimeCriteriaOps, tIdCriteriaOps, tLastUpdateDateTimeCriteriaOps, tLastUpdatedByCriteriaOps, tLastUpdatedByIdCriteriaOps>.EntityDataAccess
            where   tLanguage                       : Entity<tEntity, tHooks, tPrefetch, tProperties, tDataObject, tDataObjectList, tCriteria, tOrderBySelection, tModification, tSelection, tPropertySelection, tIndexSelection, tBusiness, tDataAccess, tLanguage, tCreatedByCriteriaOps, tCreatedByIdCriteriaOps, tCreationDateTimeCriteriaOps, tIdCriteriaOps, tLastUpdateDateTimeCriteriaOps, tLastUpdatedByCriteriaOps, tLastUpdatedByIdCriteriaOps>.EntityLanguage
            where   tCreatedByCriteriaOps           : Entity<tEntity, tHooks, tPrefetch, tProperties, tDataObject, tDataObjectList, tCriteria, tOrderBySelection, tModification, tSelection, tPropertySelection, tIndexSelection, tBusiness, tDataAccess, tLanguage, tCreatedByCriteriaOps, tCreatedByIdCriteriaOps, tCreationDateTimeCriteriaOps, tIdCriteriaOps, tLastUpdateDateTimeCriteriaOps, tLastUpdatedByCriteriaOps, tLastUpdatedByIdCriteriaOps>.EntityCriteria.RelatedOps<User.Criteria>
            where   tCreatedByIdCriteriaOps         : Entity<tEntity, tHooks, tPrefetch, tProperties, tDataObject, tDataObjectList, tCriteria, tOrderBySelection, tModification, tSelection, tPropertySelection, tIndexSelection, tBusiness, tDataAccess, tLanguage, tCreatedByCriteriaOps, tCreatedByIdCriteriaOps, tCreationDateTimeCriteriaOps, tIdCriteriaOps, tLastUpdateDateTimeCriteriaOps, tLastUpdatedByCriteriaOps, tLastUpdatedByIdCriteriaOps>.EntityCriteria.CommonOps<System.Guid>
            where   tCreationDateTimeCriteriaOps    : Entity<tEntity, tHooks, tPrefetch, tProperties, tDataObject, tDataObjectList, tCriteria, tOrderBySelection, tModification, tSelection, tPropertySelection, tIndexSelection, tBusiness, tDataAccess, tLanguage, tCreatedByCriteriaOps, tCreatedByIdCriteriaOps, tCreationDateTimeCriteriaOps, tIdCriteriaOps, tLastUpdateDateTimeCriteriaOps, tLastUpdatedByCriteriaOps, tLastUpdatedByIdCriteriaOps>.EntityCriteria.CommonOps<DateTimeOffset>
            where   tIdCriteriaOps                  : Entity<tEntity, tHooks, tPrefetch, tProperties, tDataObject, tDataObjectList, tCriteria, tOrderBySelection, tModification, tSelection, tPropertySelection, tIndexSelection, tBusiness, tDataAccess, tLanguage, tCreatedByCriteriaOps, tCreatedByIdCriteriaOps, tCreationDateTimeCriteriaOps, tIdCriteriaOps, tLastUpdateDateTimeCriteriaOps, tLastUpdatedByCriteriaOps, tLastUpdatedByIdCriteriaOps>.EntityCriteria.CommonOps<System.Guid>
            where   tLastUpdatedByCriteriaOps       : Entity<tEntity, tHooks, tPrefetch, tProperties, tDataObject, tDataObjectList, tCriteria, tOrderBySelection, tModification, tSelection, tPropertySelection, tIndexSelection, tBusiness, tDataAccess, tLanguage, tCreatedByCriteriaOps, tCreatedByIdCriteriaOps, tCreationDateTimeCriteriaOps, tIdCriteriaOps, tLastUpdateDateTimeCriteriaOps, tLastUpdatedByCriteriaOps, tLastUpdatedByIdCriteriaOps>.EntityCriteria.RelatedOps<User.Criteria>
            where   tLastUpdatedByIdCriteriaOps     : Entity<tEntity, tHooks, tPrefetch, tProperties, tDataObject, tDataObjectList, tCriteria, tOrderBySelection, tModification, tSelection, tPropertySelection, tIndexSelection, tBusiness, tDataAccess, tLanguage, tCreatedByCriteriaOps, tCreatedByIdCriteriaOps, tCreationDateTimeCriteriaOps, tIdCriteriaOps, tLastUpdateDateTimeCriteriaOps, tLastUpdatedByCriteriaOps, tLastUpdatedByIdCriteriaOps>.EntityCriteria.CommonOps<System.Guid>
            where   tLastUpdateDateTimeCriteriaOps  : Entity<tEntity, tHooks, tPrefetch, tProperties, tDataObject, tDataObjectList, tCriteria, tOrderBySelection, tModification, tSelection, tPropertySelection, tIndexSelection, tBusiness, tDataAccess, tLanguage, tCreatedByCriteriaOps, tCreatedByIdCriteriaOps, tCreationDateTimeCriteriaOps, tIdCriteriaOps, tLastUpdateDateTimeCriteriaOps, tLastUpdatedByCriteriaOps, tLastUpdatedByIdCriteriaOps>.EntityCriteria.CommonOps<DateTimeOffset>
    {

        private static  readonly    tHooks  hooks   = new tHooks();

    }

}
