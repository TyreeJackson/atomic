using AtomicNet;

namespace AtomicNet
{

    public
    class   Main : WebService<Main, Main.Args, Main.Config>
    {

        public
        new
        class   Config : WebService<Main, Main.Args, Main.Config>.Config
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
                        Factory         = "AtomicNet.Main+Factory",
                        Key             = "main"
                    }
                },
                new Args()
            ) {}

            public  Config(Configuration.SubclassConfiguration.List subclasses, Args args) : base(subclasses, args) {}

        }

        public
        class   Args : ServiceArgs {}

        public  Main(Args args) : base(args) {}

    }

    public
    partial
    class   Configuration
    {

        public
        partial
        class   ServiceConfigs
        {

            public  Main.Config Main    = new Main.Config();

        }

    }

}
