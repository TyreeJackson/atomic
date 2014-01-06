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

            public  class   ConjunctionRouter : Atom<ConjunctionRouter>
            {
                    
                private     tCriteria           criteria;

                internal                        ConjunctionRouter(tCriteria criteria)   { this.criteria = criteria; }

                public      tCriteria           And                                     { get { throw new NotImplementedException(); } }
                public      tCriteria           Or                                      { get { throw new NotImplementedException(); } }
                public      tSelection          Select                                  { get { throw new NotImplementedException(); } }
                public      tModification       Change                                  { get { throw new NotImplementedException(); } }

            }

        }

    }

}
