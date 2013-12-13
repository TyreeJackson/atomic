using AtomicNet;
using System.Collections.Generic;
using System.Xml.Serialization;

namespace AtomicNet
{

    public
    abstract
    partial
    class       IndexedList<tIndexedList, tIndexKeyType, tIndexedItem>
    {

        public
        class   KeyProperty : Atom<KeyProperty>
        {

            public
            class   IndexKeyChangingEventArgs
            {
                public  bool    IsCanceled      { get; private set; }
                public  void    Cancel()        { this.IsCanceled = true; }
            }

            public
            delegate    void                        ChangingKeyDelegate
                                                    (
                                                        tIndexedItem                item, 
                                                        tIndexKeyType               oldKeyValue, 
                                                        tIndexKeyType               newKeyValue, 
                                                        IndexKeyChangingEventArgs   args
                                                    );

            public
            delegate    void                        ChangedKeyDelegate
                                                    (
                                                        tIndexedItem    item, 
                                                        tIndexKeyType   oldKeyValue, 
                                                        tIndexKeyType   newKeyValue
                                                    );

            private     tIndexKeyType               value                                       = default(tIndexKeyType);

            private
            readonly    tIndexedItem                item;

            private     List
                        <
                            ChangingKeyDelegate     
                        >                           changingKeyListeners                        = new List<ChangingKeyDelegate>();

            private     List
                        <
                            ChangedKeyDelegate 
                        >                           changedKeyListeners                         = new List<ChangedKeyDelegate>();

            internal    void                        JoinList(tIndexedList list)
            {
                this.changedKeyListeners.Add(list.onKeyChanged);
                this.changingKeyListeners.Add(list.onKeyChanging);
            }

            internal    void                        LeaveList(tIndexedList list)
            {
                this.changedKeyListeners.Remove(list.onKeyChanged);
                this.changingKeyListeners.Remove(list.onKeyChanging);
            }

            private     IndexKeyChangingEventArgs   RaiseChangingKeyEvent
                                                (
                                                    tIndexedItem    item, 
                                                    tIndexKeyType   oldKeyValue, 
                                                    tIndexKeyType   newKeyValue
                                                )
            {
                IndexKeyChangingEventArgs   args    = new IndexKeyChangingEventArgs();
                foreach(ChangingKeyDelegate listener in this.changingKeyListeners)
                {
                    listener(item, oldKeyValue, newKeyValue, args);
                    if (args.IsCanceled)    break;
                }
                return args;
            }

            private     void                    RaiseChangedKeyEvent
                                                (
                                                    tIndexedItem    item, 
                                                    tIndexKeyType   oldKeyValue,
                                                    tIndexKeyType   newKeyValue
                                                )                                           { foreach(ChangedKeyDelegate listener in this.changedKeyListeners)    listener(item, oldKeyValue, newKeyValue); }

            public      void                    SetValue(tIndexKeyType value)
            {
                Throw<System.ArgumentException>.If(value==null, "Indexed list can only hold items with non-null item keys");

                if (value.Equals(this.value))   return;

                Throw<System.ArgumentException>.If(this.RaiseChangingKeyEvent(this.item, this.value, value).IsCanceled, "Updated was canceled.  Duplicate key was encountered in a list containing this item.");

                this.RaiseChangedKeyEvent(item, this.value, this.value = value);
            }

            public
            static
            implicit
            operator                            tIndexKeyType(KeyProperty property)         { return property != null ? property.value : default(tIndexKeyType); }

            public                              KeyProperty(tIndexedItem item)              { this.item = item; }

        }

    }

}
