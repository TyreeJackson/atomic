using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AtomicNet
{

    public
    delegate    void    SelectAndSaveFunction<tDataObjectList>(tDataObjectList entityRecords, TransactionGroup transaction, ValidationWarning.List validationWarings);

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

    }

}
