using AtomicNet;

namespace AtomicNet
{

    public
    abstract
    partial
    class       Product<tProduct, tProductArgs> : Atom<tProduct, tProductArgs>
    where       tProduct                        : Product<tProduct, tProductArgs>
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
                Promise<tProduct>               Create(string key, tProductArgs args)
                {
                    return  Atomic.Promise<tProduct>
                    ((resolve, reject)=>
                    {
                        this.LookupInstanceFactory(key)
                        .WhenDone
                        (
                            factory=>resolve(factory.Create(args)),
                            reject
                        );
                    });
                }

                protected
                virtual
                Promise<AbstractFactory>        LookupInstanceFactory(string key)
                {
                    return  Atomic.Promise<AbstractFactory>
                    ((resolve, reject)=>
                    {
                                                                this.GetInstanceConfiguration(key)
                        .Then       (instanceConfiguration=>    this.GetSubClassConfiguration(instanceConfiguration.SubClassKey),   reject)
                        .Then       (subClassConfiguration=>    this.GetSubClassFactory(subClassConfiguration),                     reject)
                        .WhenDone   (abstractFactory=>          resolve(abstractFactory),                                           reject);
                    });
                }

                protected
                virtual
                Promise<Configuration.Instance> GetInstanceConfiguration(string key)
                {
                    return  Atomic.Promise<Configuration.Instance>
                    ((resolve, reject)=>
                    {
                        #warning NotImplemented
                        reject(new System.NotImplementedException());
                    });
                }

                protected
                virtual
                Promise<Configuration.SubClass> GetSubClassConfiguration(string key)
                {
                    return  Atomic.Promise<Configuration.SubClass>
                    ((resolve, reject)=>
                    {
                        #warning NotImplemented
                        reject(new System.NotImplementedException());
                    });
                }

                protected
                virtual
                Promise<AbstractFactory>        GetSubClassFactory(Configuration.SubClass subClassConfiguration)
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
