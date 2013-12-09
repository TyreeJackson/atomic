using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AtomicNet
{

    public
    abstract    class   AtomicService : Component<AtomicService, AtomicService.ServiceArgs, AtomicService.Config>
    {

        public
        new
        class       Config : Component<AtomicService, AtomicService.ServiceArgs, AtomicService.Config>.Config
        {
            public  Config(Configuration.SubclassConfiguration.List subclasses, string key, ServiceArgs args) : base(subclasses, key, args) {}
        }

        public
        class       ServiceArgs{}

        public
        abstract    bool    IsReusable  { get; }

        protected           AtomicService(ServiceArgs args) : base(args) {}

    }

    public
    abstract
    class       AtomicService<tAtomicService, tAtomicServiceArgs, tAtomicServiceConfig> : AtomicService
    where       tAtomicService                                                          : AtomicService<tAtomicService, tAtomicServiceArgs, tAtomicServiceConfig>
    where       tAtomicServiceArgs                                                      : AtomicService<tAtomicService, tAtomicServiceArgs, tAtomicServiceConfig>.ServiceArgs
    where       tAtomicServiceConfig                                                    : AtomicService<tAtomicService, tAtomicServiceArgs, tAtomicServiceConfig>.Config
    {

        private
        static
        readonly    string  _name           = typeof(tAtomicService).Name;

        private
        static
        readonly    string  _factoryName    = typeof(tAtomicService).FullName + "+Factory";

        public
        new
        class       Config : Component<AtomicService, AtomicService.ServiceArgs, AtomicService.Config>.Config
        {
            public  Config(tAtomicServiceArgs args)
            :
            this
            (
                new Configuration.SubclassConfiguration.List()
                {
                    new Configuration.SubclassConfiguration()
                    {
                        AssemblyFile    = typeof(tAtomicService).Assembly.Location,
                        Factory         = _factoryName,
                        Key             = _name
                    }
                },
                args
            ) {}

            public  Config(Configuration.SubclassConfiguration.List subclasses, tAtomicServiceArgs args) : base(subclasses, _name, args) {}
        }

        public
        override    bool    IsReusable                              { get { return true; } }

        protected           AtomicService(tAtomicServiceArgs args)  : base(args) {}

    }

}
