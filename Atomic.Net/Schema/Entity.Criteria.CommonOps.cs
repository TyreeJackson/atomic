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
        partial class   EntityCriteria
        {

            public
            partial class   CommonOps<t> : Atom<CommonOps<t>>
            {

                private     tCriteria   criteria;

                internal                CommonOps(tCriteria criteria)   { this.criteria = criteria; }

                public      IsEqualOp   IsEqual                         { get { return new IsEqualOp(this.criteria); } }

            }

        }

    }

}
