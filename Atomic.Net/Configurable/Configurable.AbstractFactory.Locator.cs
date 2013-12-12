using AtomicNet;

namespace AtomicNet
{

    public
    abstract
    partial
    class       Configurable<tConfigurable, tConfigurableArgs>
    {

        private
        static      AbstractFactory.Locator locator;

        protected
        static      AbstractFactory.Locator Locator
        {
            get
            {
                if (Configurable<tConfigurable, tConfigurableArgs>.locator == null)
                Configurable<tConfigurable, tConfigurableArgs>.locator  = new AbstractFactory.Locator();
                return Configurable<tConfigurable, tConfigurableArgs>.locator;
            }
        }

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
