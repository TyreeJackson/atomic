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
                Promise<AbstractFactory>                        LookupSubclassFactory(string subclassKey)
                {
                    return  Atomic.Promise<AbstractFactory>
                    ((resolve, reject)=>
                    {
                        this.GetSubClassConfiguration(subclassKey)
                        .RelayTo    (this.GetSubClassFactory, reject)
                        .WhenDone   (resolve, reject);
                    });
                }

                protected
                virtual
                Promise<Configuration.SubclassConfiguration>    GetSubClassConfiguration(string key)
                {
                    return  Atomic.Promise<Configuration.SubclassConfiguration>
                    ((resolve, reject)=>
                    {
                        resolve(Configuration.Config.Classes[TypeSupport<tConfigurable>.FullName].Subclasses.TryReturnValue(key, null));
                    });
                }

                protected
                virtual
                Promise<AbstractFactory>                        GetSubClassFactory(Configuration.SubclassConfiguration subClassConfiguration)
                {
                    return  Atomic.Promise<AbstractFactory>
                    ((resolve, reject)=>
                    {
                        this.GetAssemblyFor(subClassConfiguration)
                        .WhenDone
                        (
                            assembly=>
                            {
                                if (assembly.GetType(subClassConfiguration.Factory, false, true) == null)   reject(new System.Configuration.ConfigurationException("Factory " + subClassConfiguration.Factory + " was not found in the assembly " + subClassConfiguration.AssemblyFile));
                                else                                                                        resolve((AbstractFactory) assembly.CreateInstance(subClassConfiguration.Factory, true));
                            },
                            reject
                        );
                    });
                }

                protected
                virtual
                Promise<System.Reflection.Assembly>             GetAssemblyFor(Configuration.SubclassConfiguration subClassConfiguration)
                {
                    return  Atomic.Promise<System.Reflection.Assembly>
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
