using NotImplementedException   = System.NotImplementedException;
using EditorBrowsableAttribute  = System.ComponentModel.EditorBrowsableAttribute;
using EditorBrowsableState      = System.ComponentModel.EditorBrowsableState;

namespace AtomicNet
{   partial class   Entity<tEntity, tHooks, tPrefetch, tProperties, tDataObject, tDataObjectList, tCriteria, tOrderBySelection, tModification, tSelection, tPropertySelection, tIndexSelection, tBusiness, tDataAccess, tLanguage, tCreatedByCriteriaOps, tCreatedByIdCriteriaOps, tCreationDateTimeCriteriaOps, tIdCriteriaOps, tLastUpdateDateTimeCriteriaOps, tLastUpdatedByCriteriaOps, tLastUpdatedByIdCriteriaOps>
{

    [EditorBrowsable(EditorBrowsableState.Never)]
    public
    partial class   EntitySelection : Atom<EntitySelection>
    {

        public  tSelection      All                                             { get { throw new NotImplementedException(); } }
        public  tSelection      CreatedById                                     { get { throw new NotImplementedException(); } }
        public  tSelection      CreationDateTime                                { get { throw new NotImplementedException(); } }
        public  tSelection      Id                                              { get { throw new NotImplementedException(); } }
        public  tSelection      LastUpdatedById                                 { get { throw new NotImplementedException(); } }
        public  tSelection      LastUdpateDateTime                              { get { throw new NotImplementedException(); } }

        public  tDataObjectList Select()                                        { throw new NotImplementedException(); }
        public  tDataObjectList SelectTo(out tDataObjectList dataObjectList)    { throw new NotImplementedException(); }


    }

}}
