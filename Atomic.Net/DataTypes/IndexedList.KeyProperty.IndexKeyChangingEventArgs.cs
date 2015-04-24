namespace AtomicNet
{   partial class   IndexedList<tIndexedList, tIndexKeyType, tIndexedItem>
{   partial class   KeyProperty : Atom<KeyProperty>
{

    public
    class   IndexKeyChangingEventArgs
    {
        public  bool    IsCanceled      { get; private set; }
        public  void    Cancel()        { this.IsCanceled = true; }
    }

}}}
