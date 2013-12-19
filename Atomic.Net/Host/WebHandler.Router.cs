using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AtomicNet
{

    public
    abstract
    partial     class   WebHandler : Atom<WebHandler>
    {

        public
        abstract
        partial     class   Router : Component<Router, Router.Args, Router.Config>
        {

            internal
            static      Router                  Instance;

            static  Router()
            {
                #warning Hardcoding Default Router here until we have the abstract factory implementation and configuration complete
                Router.Instance = new DefaultRouter(null);
                return;

                WebHandler.Router.Locator.Create(Configuration.Get<Router.Config>().SubclassKey, Configuration.Get<Router.Config>().args)
                .WhenDone(router=>Router.Instance = router, ex=>{throw ex;});
            }

            public
            abstract    Promise<WebHandler>  Map(HostContext context);

            public      Router(Args args) : base(args) {}

        }

    }

}
