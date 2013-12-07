using AtomicNet;
using System.Collections.Generic;
using System.Xml.Serialization;

namespace AtomicNet
{

    public
    abstract
    class       IndexedList<tIndexedList, tIndexKey, tIndexValue>
    :
                Atom
                <
                    tIndexedList, 
                    System.Func
                    <
                        tIndexValue, 
                        IndexedList
                        <
                            tIndexedList, 
                            tIndexKey, 
                            tIndexValue
                        >.KeyProperty
                    >
                >,
                IList<tIndexValue>, 
                IXmlSerializable
    where       tIndexedList                : IndexedList<tIndexedList, tIndexKey, tIndexValue>
    {

        public
        class   KeyProperty : Atom<KeyProperty>
        {

            public  void    SetValue(tIndexKey value)
            {
                #warning NotImplemented
                throw new System.NotImplementedException();
            }

            public
            static
            implicit
            operator    tIndexKey(KeyProperty property)
            {
                #warning NotImplemented
                throw new System.NotImplementedException();
            }

        }

        public      IndexedList(System.Func<tIndexValue, KeyProperty> getKeyProperty) : base(getKeyProperty) {}

        public  int IndexOf(tIndexValue item)
        {
            #warning NotImplemented
            throw new System.NotImplementedException();
        }

        public void Insert(int index, tIndexValue item)
        {
            #warning NotImplemented
            throw new System.NotImplementedException();
        }

        public void RemoveAt(int index)
        {
            #warning NotImplemented
            throw new System.NotImplementedException();
        }

        public tIndexValue this[int index]
        {
            get
            {
                #warning NotImplemented
                throw new System.NotImplementedException();
            }
            set
            {
                #warning NotImplemented
                throw new System.NotImplementedException();
            }
        }

        public void Add(tIndexValue item)
        {
            #warning NotImplemented
            throw new System.NotImplementedException();
        }

        public void Clear()
        {
            #warning NotImplemented
            throw new System.NotImplementedException();
        }

        public bool Contains(tIndexValue item)
        {
            #warning NotImplemented
            throw new System.NotImplementedException();
        }

        public void CopyTo(tIndexValue[] array, int arrayIndex)
        {
            #warning NotImplemented
            throw new System.NotImplementedException();
        }

        public int Count
        {
            get
            {
                #warning NotImplemented
                throw new System.NotImplementedException();
            }
        }

        public bool IsReadOnly
        {
            get
            {
                #warning NotImplemented
                throw new System.NotImplementedException();
            }
        }

        public bool Remove(tIndexValue item)
        {
            #warning NotImplemented
            throw new System.NotImplementedException();
        }

        public IEnumerator<tIndexValue> GetEnumerator()
        {
            #warning NotImplemented
            throw new System.NotImplementedException();
        }

        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            #warning NotImplemented
            throw new System.NotImplementedException();
        }

        public System.Xml.Schema.XmlSchema GetSchema()
        {
            #warning NotImplemented
            throw new System.NotImplementedException();
        }

        public void ReadXml(System.Xml.XmlReader reader)
        {
            #warning NotImplemented
            throw new System.NotImplementedException();
        }

        public void WriteXml(System.Xml.XmlWriter writer)
        {
            #warning NotImplemented
            throw new System.NotImplementedException();
        }

    }

}
