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

            public
            class   Args {}

            public
            new
            class   Config : Component<Router, Router.Args, Router.Config>.BaseConfig
            {

                public  Config()
                :
                this
                (
                    new Configuration.SubclassConfiguration.List()
                    {
                        new Configuration.SubclassConfiguration()
                        {
                            AssemblyFile    = System.Reflection.Assembly.GetExecutingAssembly().Location,
                            Factory         = "AtomicNet.AtomicHandler+DefaultRouter+Factory",
                            Key             = "router"
                        }
                    },
                    "router",
                    null
                ) {}

                public  Config(Configuration.SubclassConfiguration.List subclasses, string key, Args args) : base(subclasses, key, args) {}

            }

        }

    }

    public
    partial
    class   Configuration
    {

        public
        partial
        class   ServiceConfigs
        {

            public  WebHandler.Router.Config AtomicHandlerRouter = new WebHandler.Router.Config();

        }

    }

}
