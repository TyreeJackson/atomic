using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AtomicNet
{

    public
    partial class   Entity
    {
    }

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
                        tDataObjectSelection,
                        tPropertySelection,
                        tIndexSelection,
                        tBusiness,
                        tDataAccess
                    >
    :
                    Entity
    {

        public
        static  tCriteria           Where   { get { throw new NotImplementedException(); } }

        public
        static  tOrderBySelection   OrderBy { get { throw new NotImplementedException(); } }

    }

}
