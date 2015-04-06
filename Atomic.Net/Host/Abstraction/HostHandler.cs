using System;
using System.Threading.Tasks;
namespace AtomicNet
{

    public
    abstract    class   HostHandler : Atom<HostHandler>
    {

        private WebHandler.Router   router { get; set; }

        public                      HostHandler(WebHandler.Router router)
        {
            Throw<ArgumentNullException>.If(router==null, "router");
            this.router = router;
        }

        public
        async   Task                ProcessRequest(HostContext context)
        {
            await (await this.router.Map(context)).ProcessRequest(context);
        }

    }

}
