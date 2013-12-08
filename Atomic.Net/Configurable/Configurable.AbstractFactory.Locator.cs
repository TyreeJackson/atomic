using AtomicNet;

namespace AtomicNet
{

    public
    abstract
    partial
    class       Configurable<tConfigurable, tConfigurableArgs>
    {

        public
        abstract
        partial
        class      AbstractFactory
        {

            public
            class   Locator
            {

                public
                Promise<tConfigurable>               Create(string key, tConfigurableArgs args)
                {
                    return  Atomic.Promise<tConfigurable>
                    ((resolve, reject)=>
                    {
                        this.LookupSubclassFactory(key)
                        .WhenDone
                        (
                            factory=>resolve(factory.Create(args)),
                            reject
                        );
                    });
                }

                protected
                virtual
                Promise<AbstractFactory>        LookupSubclassFactory(string subclassKey)
                {
                    return  Atomic.Promise<AbstractFactory>
                    ((resolve, reject)=>
                    {
                                                                this.GetSubClassConfiguration(subclassKey)
                        .Then       (subClassConfiguration=>    this.GetSubClassFactory(subClassConfiguration), reject)
                        .WhenDone   (abstractFactory=>          resolve(abstractFactory),                       reject);
                    });
                }

                protected
                virtual
                Promise<Configuration.InstanceConfiguration> GetInstanceConfiguration(string key)
                {
                    return  Atomic.Promise<Configuration.InstanceConfiguration>
                    ((resolve, reject)=>
                    {
                        //Configuration.Config
                        #warning NotImplemented
                        reject(new System.NotImplementedException());
                    });
                }

                protected
                virtual
                Promise<Configuration.SubclassConfiguration> GetSubClassConfiguration(string key)
                {
                    return  Atomic.Promise<Configuration.SubclassConfiguration>
                    ((resolve, reject)=>
                    {
                        #warning NotImplemented
                        reject(new System.NotImplementedException());
                    });
                }

                protected
                virtual
                Promise<AbstractFactory>        GetSubClassFactory(Configuration.SubclassConfiguration subClassConfiguration)
                {
                    return  Atomic.Promise<AbstractFactory>
                    ((resolve, reject)=>
                    {
                        #warning NotImplemented
                        reject(new System.NotImplementedException());
                    });
                }

            }

        }

    }

}
