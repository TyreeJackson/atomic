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
                throw new System.NotImplementedException();
            }

            public
            static
            implicit
            operator    tIndexKey(KeyProperty property)
            {
                throw new System.NotImplementedException();
            }

        }

        public      IndexedList(System.Func<tIndexValue, KeyProperty> getKeyProperty) : base(getKeyProperty) {}

        public  int IndexOf(tIndexValue item)
        {
            throw new System.NotImplementedException();
        }

        public void Insert(int index, tIndexValue item)
        {
            throw new System.NotImplementedException();
        }

        public void RemoveAt(int index)
        {
            throw new System.NotImplementedException();
        }

        public tIndexValue this[int index]
        {
            get
            {
                throw new System.NotImplementedException();
            }
            set
            {
                throw new System.NotImplementedException();
            }
        }

        public void Add(tIndexValue item)
        {
            throw new System.NotImplementedException();
        }

        public void Clear()
        {
            throw new System.NotImplementedException();
        }

        public bool Contains(tIndexValue item)
        {
            throw new System.NotImplementedException();
        }

        public void CopyTo(tIndexValue[] array, int arrayIndex)
        {
            throw new System.NotImplementedException();
        }

        public int Count
        {
            get
            {
                throw new System.NotImplementedException();
            }
        }

        public bool IsReadOnly
        {
            get
            {
                throw new System.NotImplementedException();
            }
        }

        public bool Remove(tIndexValue item)
        {
            throw new System.NotImplementedException();
        }

        public IEnumerator<tIndexValue> GetEnumerator()
        {
            throw new System.NotImplementedException();
        }

        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            throw new System.NotImplementedException();
        }

        public System.Xml.Schema.XmlSchema GetSchema()
        {
            throw new System.NotImplementedException();
        }

        public void ReadXml(System.Xml.XmlReader reader)
        {
            throw new System.NotImplementedException();
        }

        public void WriteXml(System.Xml.XmlWriter writer)
        {
            throw new System.NotImplementedException();
        }

    }

}
