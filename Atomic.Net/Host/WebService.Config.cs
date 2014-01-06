using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AtomicNet
{

    public
    abstract
    partial     class   WebService : Component<WebService, WebService.ServiceArgs, WebService.BaseConfig>
    {

        public
        new
        class       BaseConfig : Component<WebService, WebService.ServiceArgs, WebService.BaseConfig>.BaseConfig
        {
            public  BaseConfig(Configuration.SubclassConfiguration.List subclasses, string key, ServiceArgs args) : base(subclasses, key, args) {}
        }

    }

    public
    abstract
    partial 
    class       WebService<tWebService, tWebServiceArgs, tWebServiceConfig>
    {

        public
        new
        class       ServiceConfig : WebService.BaseConfig
        {
            public  ServiceConfig(tWebServiceArgs args)
            :
            this
            (
                new Configuration.SubclassConfiguration.List()
                {
                    new Configuration.SubclassConfiguration()
                    {
                        AssemblyFile    = typeof(tWebService).Assembly.Location,
                        Factory         = _factoryName,
                        Key             = _name
                    }
                },
                args
            ) {}

            public  ServiceConfig(Configuration.SubclassConfiguration.List subclasses, tWebServiceArgs args) : base(subclasses, _name, args) {}
        }

    }

}
