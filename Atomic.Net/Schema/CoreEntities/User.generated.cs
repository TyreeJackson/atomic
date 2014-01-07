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

        [EditorBrowsable(EditorBrowsableState.Never)] 
        public
        partial class   Prefetch : EntityPrefetch
        {
        }

        public
        partial class   Properties : EntityProperties
        {

            public  class   FirstName                                                   { [EditorBrowsable(EditorBrowsableState.Never)] public  class   Ops : EntityCriteria.CommonOps<System.String> { public  Ops(Criteria criteria) : base(criteria) {} } }
            public  class   LastName                                                    { [EditorBrowsable(EditorBrowsableState.Never)] public  class   Ops : EntityCriteria.CommonOps<System.String> { public  Ops(Criteria criteria) : base(criteria) {} } }
            public  class   UserName                                                    { [EditorBrowsable(EditorBrowsableState.Never)] public  class   Ops : EntityCriteria.CommonOps<System.String> { public  Ops(Criteria criteria) : base(criteria) {} } }

        }

        [EditorBrowsable(EditorBrowsableState.Never)] public  class   CreatedByOps            : EntityProperties.CreatedBy.Ops            { [EditorBrowsable(EditorBrowsableState.Never)] public CreatedByOps(Criteria criteria) : base(criteria) {} }
        [EditorBrowsable(EditorBrowsableState.Never)] public  class   CreatedByIdOps          : EntityProperties.CreatedById.Ops          { [EditorBrowsable(EditorBrowsableState.Never)] public CreatedByIdOps(Criteria criteria) : base(criteria) {} }
        [EditorBrowsable(EditorBrowsableState.Never)] public  class   CreationDateTimeOps     : EntityProperties.CreationDateTime.Ops     { [EditorBrowsable(EditorBrowsableState.Never)] public CreationDateTimeOps(Criteria criteria) : base(criteria) {} }
        [EditorBrowsable(EditorBrowsableState.Never)] public  class   IdOps                   : EntityProperties.Id.Ops                   { [EditorBrowsable(EditorBrowsableState.Never)] public IdOps(Criteria criteria) : base(criteria) {} }
        [EditorBrowsable(EditorBrowsableState.Never)] public  class   LastUpdatedByOps        : EntityProperties.LastUpdatedBy.Ops        { [EditorBrowsable(EditorBrowsableState.Never)] public LastUpdatedByOps(Criteria criteria) : base(criteria) {} }
        [EditorBrowsable(EditorBrowsableState.Never)] public  class   LastUpdatedByIdOps      : EntityProperties.LastUpdatedById.Ops      { [EditorBrowsable(EditorBrowsableState.Never)] public LastUpdatedByIdOps(Criteria criteria) : base(criteria) {} }
        [EditorBrowsable(EditorBrowsableState.Never)] public  class   LastUpdateDateTimeOps   : EntityProperties.LastUpdateDateTime.Ops   { [EditorBrowsable(EditorBrowsableState.Never)] public LastUpdateDateTimeOps(Criteria criteria) : base(criteria) {} }
        [EditorBrowsable(EditorBrowsableState.Never)] public  class   FirstNameOps            : Properties.FirstName.Ops                  { [EditorBrowsable(EditorBrowsableState.Never)] public FirstNameOps(Criteria criteria) : base(criteria) {} }
        [EditorBrowsable(EditorBrowsableState.Never)] public  class   LastNameOps             : Properties.FirstName.Ops                  { [EditorBrowsable(EditorBrowsableState.Never)] public LastNameOps(Criteria criteria) : base(criteria) {} }
        [EditorBrowsable(EditorBrowsableState.Never)] public  class   UserNameOps             : Properties.FirstName.Ops                  { [EditorBrowsable(EditorBrowsableState.Never)] public UserNameOps(Criteria criteria) : base(criteria) {} }

        public
        partial class   DataObject : EntityDataObject
        {
        }

        public
        partial class   DataObjectList : EntityDataObjectList
        {
        }

        [EditorBrowsable(EditorBrowsableState.Never)] 
        public
        partial class   Criteria : EntityCriteria
        {
            public  FirstNameOps    FirstName   { get { throw new System.NotImplementedException(); } }
            public  LastNameOps     LastName    { get { throw new System.NotImplementedException(); } }
            public  UserNameOps     UserName    { get { throw new System.NotImplementedException(); } }
        }

        [EditorBrowsable(EditorBrowsableState.Never)] 
        public
        partial class   OrderBySelection : EntityOrderBySelection
        {
        }

        [EditorBrowsable(EditorBrowsableState.Never)] 
        public
        partial class   Modification : EntityModification
        {
            public  Modification    FirstName   { get { throw new NotImplementedException(); } }
            public  Modification    LastName    { get { throw new NotImplementedException(); } }
            public  Modification    UserName    { get { throw new NotImplementedException(); } }
        }

        [EditorBrowsable(EditorBrowsableState.Never)] 
        public
        partial class   Selection : EntitySelection
        {
            public  Selection   FirstName   { get { throw new NotImplementedException(); } }
            public  Selection   LastName    { get { throw new NotImplementedException(); } }
            public  Selection   UserName    { get { throw new NotImplementedException(); } }
        }

        [EditorBrowsable(EditorBrowsableState.Never)] 
        public
        partial class   PropertySelection : EntityPropertySelection
        {
        }

        [EditorBrowsable(EditorBrowsableState.Never)] 
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

        [EditorBrowsable(EditorBrowsableState.Never)] 
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