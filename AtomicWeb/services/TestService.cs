using AtomicNet;

namespace AtomicWeb
{

    public  class   TestService : WebService<TestService>
    {

        public  TestService()   {}

        public  void    Main()
        {

            Entities.User.DataObjectList    users   = new User.DataObjectList();

            Query.User
            .OnBehalfOf [RequestedUser]
            .Where      .Id         .IsEqual[System.Guid.Empty]
            .And        .FirstName  .IsEqual[string.Empty]
            .And        .LastName   .IsEqual[string.Empty]
            .And        .CreatedBy
                        [createdByWhere=>
                            createdByWhere  .CreationDateTime   .IsEqual[DateTimeOffset.MinValue]
                        ]
            .Select     .Id
                        .FirstName
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