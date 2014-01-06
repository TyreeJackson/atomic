using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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

    }

}
