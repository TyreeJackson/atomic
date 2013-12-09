using AtomicNet;

namespace AtomicNet
{

    public
    abstract
    partial
    class       Configuration : Atom<Configuration>
    {

        public
        class   Instance
        {
            public  List.KeyProperty    key;
            public  string              Key             { get { return this.key; } set { this.key.SetValue(value); } }
            public  string              SubClassKey;

            public
            class   List : IndexedList<List, string, Instance>
            {
                public  List() : base(a=>a.key)
                {
                    #warning NotImplemented
                    throw new System.NotImplementedException();
                }
            }

        }

    }

}
