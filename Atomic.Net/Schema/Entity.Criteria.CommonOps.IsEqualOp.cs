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
            partial class   CommonOps<t>
            {

                public  class   IsEqualOp : Atom<IsEqualOp>
                {
                    
                    private     tCriteria           criteria;

                    internal                        IsEqualOp(tCriteria criteria)   { this.criteria = criteria; }

                    public      ConjunctionRouter   this[t value]                   { get { throw new NotImplementedException(); } }

                }

            }

        }

    }

}
