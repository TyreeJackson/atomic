using AtomicNet;
using System.Threading.Tasks;

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
                async       Task<tConfigurable>                         Create(string key, tConfigurableArgs args)
                {
                    return (await this.LookupSubclassFactory(key)).Create(args);
                }

                protected
                virtual
                async       Task<AbstractFactory>                       LookupSubclassFactory(string subclassKey)
                {
                    return await this.GetSubClassFactory(await this.GetSubClassConfiguration(subclassKey));
                }

                protected
                virtual
                async       Task<Configuration.SubclassConfiguration>   GetSubClassConfiguration(string key)
                {
                    return Configuration.Config.Classes[TypeSupport<tConfigurable>.FullName].Subclasses.TryReturnValue(key, null);
                }

                protected
                virtual
                async       Task<AbstractFactory>                       GetSubClassFactory(Configuration.SubclassConfiguration subClassConfiguration)
                {
                    System.Reflection.Assembly  assembly    = await this.GetAssemblyFor(subClassConfiguration);

                    if (assembly.GetType(subClassConfiguration.Factory, false, true) == null)   throw new System.Configuration.ConfigurationException("Factory " + subClassConfiguration.Factory + " was not found in the assembly " + subClassConfiguration.AssemblyFile);
                    else                                                                        return (AbstractFactory) assembly.CreateInstance(subClassConfiguration.Factory, true);
                }

                protected
                virtual
                async       Task<System.Reflection.Assembly>            GetAssemblyFor(Configuration.SubclassConfiguration subClassConfiguration)
                {
                    #warning NotImplemented
                    throw new System.NotImplementedException();
                }

            }

        }

    }

}
