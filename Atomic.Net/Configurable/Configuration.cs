using AtomicNet;

namespace AtomicNet
{

    public
    abstract
    class       Configuration : Atom<Configuration>
    {

        public
        class   SubClass
        {
            public  List.KeyProperty    key;
            public  string              Key             { get { return this.key; } set { this.key.SetValue(value); } }
            public  string              Factory;
            public  string              AssemblyFile;

            public
            class   List : IndexedList<List, string, SubClass>
            {
                public  List() : base(a=>a.key)
                {
                    throw new System.NotImplementedException();
                }
            }

        }

        public
        static  Configuration   Config;

    }

}
