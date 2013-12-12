using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AtomicNet
{

    public
    abstract
    partial     class   AtomicService : Component<AtomicService, AtomicService.ServiceArgs, AtomicService.Config>
    {

        public
        new
        class       Config : Component<AtomicService, AtomicService.ServiceArgs, AtomicService.Config>.Config
        {
            public  Config(Configuration.SubclassConfiguration.List subclasses, string key, ServiceArgs args) : base(subclasses, key, args) {}
        }

    }

    public
    abstract
    partial 
    class       AtomicService<tAtomicService, tAtomicServiceArgs, tAtomicServiceConfig>
    {

        public
        new
        class       Config : AtomicService.Config
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

    }

}
