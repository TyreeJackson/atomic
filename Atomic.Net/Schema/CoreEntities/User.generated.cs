using NotImplementedException   = System.NotImplementedException;
using EditorBrowsableAttribute  = System.ComponentModel.EditorBrowsableAttribute;
using EditorBrowsableState      = System.ComponentModel.EditorBrowsableState;

namespace AtomicNet
{

    [EditorBrowsable(EditorBrowsableState.Never)]
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
                        User.DataAccess,
                        User.Language,
                        User.CreatedByOps, 
                        User.CreatedByIdOps, 
                        User.CreationDateTimeOps, 
                        User.IdOps, 
                        User.LastUpdateDateTimeOps, 
                        User.LastUpdatedByOps, 
                        User.LastUpdatedByIdOps
                    >
    {

        public
        partial class   Prefetch : EntityPrefetch
        {
        }

        public
        partial class   Properties : EntityProperties
        {

            public  class   FirstName                                                   { public  class   Ops : EntityCriteria.CommonOps<System.String> { public  Ops(Criteria criteria) : base(criteria) {} } }

            public  class   LastName                                                    { public  class   Ops : EntityCriteria.CommonOps<System.String> { public  Ops(Criteria criteria) : base(criteria) {} } }

            public  class   UserName                                                    { public  class   Ops : EntityCriteria.CommonOps<System.String> { public  Ops(Criteria criteria) : base(criteria) {} } }

        }

        public  class   CreatedByOps            : EntityProperties.CreatedBy.Ops            { public CreatedByOps(Criteria criteria) : base(criteria) {} }

        public  class   CreatedByIdOps          : EntityProperties.CreatedById.Ops          { public CreatedByIdOps(Criteria criteria) : base(criteria) {} }

        public  class   CreationDateTimeOps     : EntityProperties.CreationDateTime.Ops     { public CreationDateTimeOps(Criteria criteria) : base(criteria) {} }

        public  class   IdOps                   : EntityProperties.Id.Ops                   { public IdOps(Criteria criteria) : base(criteria) {} }

        public  class   LastUpdatedByOps        : EntityProperties.LastUpdatedBy.Ops        { public LastUpdatedByOps(Criteria criteria) : base(criteria) {} }

        public  class   LastUpdatedByIdOps      : EntityProperties.LastUpdatedById.Ops      { public LastUpdatedByIdOps(Criteria criteria) : base(criteria) {} }

        public  class   LastUpdateDateTimeOps   : EntityProperties.LastUpdateDateTime.Ops   { public LastUpdateDateTimeOps(Criteria criteria) : base(criteria) {} }

        public  class   FirstNameOps            : Properties.FirstName.Ops                  { public  FirstNameOps(Criteria criteria) : base(criteria) {} }

        public  class   LastNameOps             : Properties.FirstName.Ops                  { public  LastNameOps(Criteria criteria) : base(criteria) {} }

        public  class   UserNameOps             : Properties.FirstName.Ops                  { public  UserNameOps(Criteria criteria) : base(criteria) {} }

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
            public  FirstNameOps    FirstName   { get { throw new System.NotImplementedException(); } }
            public  LastNameOps     LastName    { get { throw new System.NotImplementedException(); } }
            public  UserNameOps     UserName    { get { throw new System.NotImplementedException(); } }
        }

        public
        partial class   OrderBySelection : EntityOrderBySelection
        {
        }

        public
        partial class   Modification : EntityModification
        {
            public  Modification    FirstName   { get { throw new NotImplementedException(); } }
            public  Modification    LastName    { get { throw new NotImplementedException(); } }
            public  Modification    UserName    { get { throw new NotImplementedException(); } }
        }

        public
        partial class   Selection : EntitySelection
        {
            public  Selection   FirstName   { get { throw new NotImplementedException(); } }
            public  Selection   LastName    { get { throw new NotImplementedException(); } }
            public  Selection   UserName    { get { throw new NotImplementedException(); } }
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

        public
        partial class   Language : EntityLanguage<Language.BehalfOf, Language.BehalfOfRouter>
        {
            [EditorBrowsable(EditorBrowsableState.Never)]
            public  class   BehalfOf : EntityBehalfOf<BehalfOfRouter> { public BehalfOf (Criteria criteria) : base(criteria) {} }
            [EditorBrowsable(EditorBrowsableState.Never)]
            public  class   BehalfOfRouter : Criteria.BehalfOfRouter { public BehalfOfRouter (Criteria criteria) : base(criteria) {} }
        }

    }

    public partial class Query { public class User : AtomicNet.User.Language { } }

}

namespace   Entities { public class User : AtomicNet.User{} }