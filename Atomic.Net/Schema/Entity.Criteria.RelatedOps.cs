using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AtomicNet
{

    public  delegate    tRelatedCriteria    RelatedCriteriaQuery<tRelatedCriteria>(tRelatedCriteria relatedCriteria);

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
            partial class   RelatedOps<tRelatedCriteria> : Atom<RelatedOps<tRelatedCriteria>>
            {

                private     tCriteria           criteria;

                internal                        RelatedOps(tCriteria criteria)              { this.criteria = criteria; }

                public      ConjunctionRouter   this
                                                [
                                                    RelatedCriteriaQuery
                                                    <
                                                        tRelatedCriteria
                                                    >                       relatedCriteria
                                                ]                                           { get { throw new NotImplementedException (); } }

            }

        }

    }

}
