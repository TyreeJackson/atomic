using AtomicNet;
using System.Collections.Generic;
using System.Xml.Serialization;

namespace AtomicNet
{

    public
    abstract
    partial
    class       IndexedList<tIndexedList, tIndexKeyType, tIndexedItem>
    :
                Atom
                <
                    tIndexedList, 
                    System.Func
                    <
                        tIndexedItem, 
                        IndexedList
                        <
                            tIndexedList, 
                            tIndexKeyType,
                            tIndexedItem
                        >.KeyProperty
                    >
                >,
                IList<tIndexedItem>, 
                IXmlSerializable
    where       tIndexedList                : IndexedList<tIndexedList, tIndexKeyType, tIndexedItem>
    where       tIndexKeyType               : System.IEquatable<tIndexKeyType>
    {

        private
        readonly    System.Func
                    <
                        tIndexedItem, 
                        KeyProperty
                    >                   getKeyProperty;
        private
        readonly    Dictionary
                    <
                        tIndexKeyType,
                        tIndexedItem
                    >                   innerDictionary     = new Dictionary<tIndexKeyType,tIndexedItem>();

        private
        readonly    List<tIndexedItem>  innerList           = new List<tIndexedItem>();

        public                          IndexedList
                                        (
                                            System.Func
                                            <
                                                tIndexedItem, 
                                                KeyProperty
                                            >                   getKeyProperty
                                        ) 
        :
                                        base(getKeyProperty)                            { this.getKeyProperty = getKeyProperty; }

        private     void                onKeyChanged
                                        (
                                            tIndexedItem    item, 
                                            tIndexKeyType   oldKeyValue, 
                                            tIndexKeyType   newKeyValue
                                        )
        {
            this.innerDictionary.Remove(oldKeyValue);
            this.innerDictionary.Add(newKeyValue, item);
        }

        private     void                onKeyChanging
                                        (
                                            tIndexedItem                item, 
                                            tIndexKeyType               oldKeyValue, 
                                            tIndexKeyType               newKeyValue, 
                                            KeyProperty
                                            .IndexKeyChangingEventArgs  args
                                        )                                               { if (this.innerDictionary.ContainsKey(newKeyValue))  args.Cancel(); }

        public      int                 IndexOf(tIndexedItem item)                      { return this.innerList.IndexOf(item); }

        private     void                AddValidItemToInnerDictionary(tIndexedItem item)
        {
            KeyProperty key;

            Throw<System.ArgumentException>
            .If     (item==null, "Indexed lists can only hold non-null items.")
            .OrIf   (this.innerDictionary.ContainsKey(key = this.getKeyProperty(item)), "Duplicate item encountered in an indexed list.");

            this.innerDictionary.Add(key, item);

            key.JoinList((tIndexedList) this);

        }

        private     void                RemoveValidItemFromInnerDictionary
                                        (
                                            tIndexedItem    item
                                        )                                               
        {
            KeyProperty     key;

            Throw<System.ArgumentException>
            .If     (item==null, "Indexed lists can only hold non-null items.")
            .OrIf   (!this.innerDictionary.ContainsKey(key = this.getKeyProperty(item)), "Item was not found in an indexed list.");

            key.LeaveList((tIndexedList) this);

            this.innerDictionary.Remove(key);
        }

        public      void                Insert(int index, tIndexedItem item)
        {
            this.AddValidItemToInnerDictionary(item);
            this.innerList.Insert(index, item);
        }

        public      void                RemoveAt(int index)
        {
            this.RemoveValidItemFromInnerDictionary(this.innerList[index]);
            this.innerList.RemoveAt(index);
        }

        public      tIndexedItem        this[int index]
        {
            get
            {
                return this.innerList[index];
            }
            set
            {
                if (index > this.innerList.Count)   this.Add(value);
                else                                this.ReplaceItem(index, value);
            }
        }

        private     void                ReplaceItem(int index, tIndexedItem value)
        {
            #warning NotImplemented
            throw new System.NotImplementedException();
        }

        public      void                Add(tIndexedItem item)
        {
            this.AddValidItemToInnerDictionary(item);
            this.innerList.Add(item);
        }

        public      void                Clear()                                         { for (int innerListCounter = this.innerList.Count-1; innerListCounter>0; innerListCounter--)   this.RemoveAt(innerListCounter); }

        public      bool                Contains(tIndexedItem item)
        {
            Throw<System.ArgumentException>
            .If     (item==null, "Indexed lists can only hold non-null items.");

            return this.innerDictionary.ContainsKey(this.getKeyProperty(item));
        }

        public      void                CopyTo(tIndexedItem[] array, int arrayIndex)    { this.innerList.CopyTo(array, arrayIndex);}

        public      int                 Count                                           { get { return this.innerList.Count; } }

        public      bool                IsReadOnly                                      { get { return false; } }

        public      bool                Remove(tIndexedItem item)
        {
            this.RemoveValidItemFromInnerDictionary(item);
            this.innerList.Remove(item);
            return true;
        }

        public      IEnumerator
                    <
                        tIndexedItem
                    >                   GetEnumerator()                                 { return this.innerList.GetEnumerator(); }

                    System
                    .Collections
                    .IEnumerator        System.Collections.IEnumerable.GetEnumerator()  { return this.innerList.GetEnumerator(); }

        public      System.Xml
                    .Schema
                    .XmlSchema          GetSchema()                                     { return null; }

        public      void                ReadXml(System.Xml.XmlReader reader)
        {
            #warning NotImplemented
            throw new System.NotImplementedException();
        }

        public      void                WriteXml(System.Xml.XmlWriter writer)
        {
            #warning NotImplemented
            throw new System.NotImplementedException();
        }

    }

}
