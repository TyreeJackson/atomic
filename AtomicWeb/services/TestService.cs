using AtomicNet;

namespace AtomicWeb
{

    public  class   TestService : WebService<TestService, TestService.Args, TestService.Config>
    {

        public  class   Args : ServiceArgs
        {
        }

        public  class   Config : ServiceConfig
        {
            public  Config(Args args) : base(args) {}
        }

        public  TestService(Args args) : base(args) {}

        public  void    Main()
        {

            Entities.User.DataObjectList    users   = new User.DataObjectList();

            Query.User
            .OnBehalfOf [RequestedUser]
            .Where      .Id                 .IsEqual[System.Guid.Empty]
            .And        .CreationDateTime   .IsEqual[DateTimeOffset.MinValue]
            .Select     .Id
                        .CreationDateTime
                        .CreatedById
            .SelectTo(out users);

            Query.User
            .OnBehalfOf [RequestedUser]
            .Where      .Id                 .IsEqual[System.Guid.Empty]
            .And        .CreationDateTime   .IsEqual[DateTimeOffset.MinValue]
            .Change     .Id
                        .CreationDateTime
                        .CreatedById
            .Save(users);

            Query.User
            .OnBehalfOf [RequestedUser]
            .Where      .Id                 .IsEqual[System.Guid.Empty]
            .And        .CreationDateTime   .IsEqual[DateTimeOffset.MinValue]
            .Change     .Id
                        .CreationDateTime
                        .CreatedById
            .SelectAndSave
            ((usersToUpdate, transaction, validationWarnings)=>
            {
            });

        }

    }

}