using AtomicNet;

namespace AtomicNet
{

    public
    abstract
    partial
    class       Configuration
    {

        public
        class       SubclassConfiguration
        {
            public  List.KeyProperty    key;
            public  string              Key             { get { return this.key; } set { this.key.SetValue(value); } }
            public  string              Factory;
            public  string              AssemblyFile;

            public
            class   List : IndexedList<List, string, SubclassConfiguration> { public  List() : base(a=>a.key) {} }

        }

    }

}
