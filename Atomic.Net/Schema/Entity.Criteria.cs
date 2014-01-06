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
        partial class   EntityCriteria : Atom<EntityCriteria>
        {

            private RequestUser     requestUser;

            private BehalfOf.Router SetRequestUser(RequestUser requestUser)
            {
                this.requestUser    = requestUser;
                return new BehalfOf.Router((tCriteria) this);
            }

            public  RelatedOps<User.Criteria>   CreatedBy           { get { throw new NotImplementedException(); } }
            public  CommonOps<Guid>             CreatedById         { get { throw new NotImplementedException(); } }
            public  CommonOps<DateTimeOffset>   CreationDateTime    { get { throw new NotImplementedException(); } }
            public  CommonOps<Guid>             Id                  { get { throw new NotImplementedException(); } }
            public  RelatedOps<User.Criteria>   LastUpdatedBy       { get { throw new NotImplementedException(); } }
            public  CommonOps<Guid>             LastUpdatedById     { get { throw new NotImplementedException(); } }
            public  CommonOps<DateTimeOffset>   LastUdpateDateTime  { get { throw new NotImplementedException(); } }

        }

    }

}
