using AtomicNet;

namespace AtomicWeb
{

    public  class   TestService : Service<TestService, TestService.Args>
    {

        public  class   Args 
        {
        }

        public  TestService(Args args) : base(args) {}

    }

}