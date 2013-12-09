using AtomicNet;

namespace AtomicNet
{

    public
    abstract
    partial
    class       Configuration
    {

        public
        class   InstanceConfiguration
        {
            public
            readonly    List.KeyProperty    key;
            public      string              Key             { get { return this.key; } set { this.key.SetValue(value); } }
            public
            readonly    string              SubclassKey;

            public
            class   List : IndexedList<List, string, InstanceConfiguration>
            {
                public  List() : base(a=>a.key)
                {
                    #warning NotImplemented
                    throw new System.NotImplementedException();
                }
            }

            protected   InstanceConfiguration(string subclassKey)
            {
                this.key            = new IndexedList<List,string,InstanceConfiguration>.KeyProperty(this);
                this.SubclassKey    = subclassKey;
            }
        }

    }

}
