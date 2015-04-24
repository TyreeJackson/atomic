using NotImplementedException   = System.NotImplementedException;
using EditorBrowsableAttribute  = System.ComponentModel.EditorBrowsableAttribute;
using EditorBrowsableState      = System.ComponentModel.EditorBrowsableState;

namespace AtomicNet
{

    [EditorBrowsable(EditorBrowsableState.Never)]
    public
    delegate    void    SelectAndSaveFunction<tDataObjectList>(tDataObjectList entityRecords, TransactionGroup transaction, ValidationWarning.List validationWarings);

}

namespace AtomicNet
{   partial class   Entity<tEntity, tHooks, tPrefetch, tProperties, tDataObject, tDataObjectList, tCriteria, tOrderBySelection, tModification, tSelection, tPropertySelection, tIndexSelection, tBusiness, tDataAccess, tLanguage, tCreatedByCriteriaOps, tCreatedByIdCriteriaOps, tCreationDateTimeCriteriaOps, tIdCriteriaOps, tLastUpdateDateTimeCriteriaOps, tLastUpdatedByCriteriaOps, tLastUpdatedByIdCriteriaOps>
{

    [EditorBrowsable(EditorBrowsableState.Never)]
    public
    partial class   EntityModification : Atom<EntityModification>
    {

        public  tModification   All                                                                 { get { throw new NotImplementedException(); } }
        public  tModification   CreatedById                                                         { get { throw new NotImplementedException(); } }
        public  tModification   CreationDateTime                                                    { get { throw new NotImplementedException(); } }
        public  tModification   Id                                                                  { get { throw new NotImplementedException(); } }
        public  tModification   LastUpdatedById                                                     { get { throw new NotImplementedException(); } }
        public  tModification   LastUdpateDateTime                                                  { get { throw new NotImplementedException(); } }

        public  tDataObjectList Save(tDataObjectList dataObjectListToSave)                          { throw new NotImplementedException(); }
        public  tDataObjectList SelectAndSave(SelectAndSaveFunction<tDataObjectList> selectAndSave) { throw new NotImplementedException(); }

    }

}}
