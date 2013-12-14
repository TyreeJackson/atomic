using System.Linq;
using AtomicNet;

namespace AtomicNet
{

    public
    abstract
    partial
    class       Configuration : Atom<Configuration>
    {

        public  Dictionary
                <
                    string,
                    ClassConfiguration
                >                       Classes = new Dictionary<string,ClassConfiguration>();

        public
        static  tConfiguration          Get<tConfiguration>() where tConfiguration : ClassConfiguration
        {
            return Configuration.Config.Classes.TryReturnValueAs<tConfiguration>(TypeSupport<tConfiguration>.FullName, null);
        }

        public
        static  Configuration           Config;

    }

}
