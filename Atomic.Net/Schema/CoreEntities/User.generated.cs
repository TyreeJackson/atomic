namespace AtomicNet
{

    public
    partial class   User
    :
                    Entity
                    <
                        User,
                        User.Prefetch,
                        User.Properties,
                        User.DataObject,
                        User.DataObjectList,
                        User.Criteria,
                        User.OrderBySelection,
                        User.Modification,
                        User.Selection,
                        User.PropertySelection,
                        User.IndexSelection,
                        User.Business,
                        User.DataAccess
                    >
    {

        public
        partial class   Prefetch : EntityPrefetch
        {
        }

        public
        partial class   Properties : EntityProperties
        {
        }

        public
        partial class   DataObject : EntityDataObject
        {
        }

        public
        partial class   DataObjectList : EntityDataObjectList
        {
        }

        public
        partial class   Criteria : EntityCriteria
        {
        }

        public
        partial class   OrderBySelection : EntityOrderBySelection
        {
        }

        public
        partial class   Modification : EntityModification
        {
        }

        public
        partial class   Selection : EntitySelection
        {
        }

        public
        partial class   PropertySelection : EntityPropertySelection
        {
        }

        public
        partial class   IndexSelection : EntityIndexSelection
        {
        }

        public
        partial class   Business : EntityBusiness
        {
        }

        public
        partial class   DataAccess : EntityDataAccess
        {
        }

    }

    public partial class Query { public class User : AtomicNet.User.Language { } }

}

namespace   Entities { public class User : AtomicNet.User{} }