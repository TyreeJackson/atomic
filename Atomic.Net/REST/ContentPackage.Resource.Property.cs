using System.Collections.Generic;

namespace AtomicNet.REST
{   partial class   ContentPackage<TContentPackage>
{   partial class   Resource
{

    public
    abstract    class   Property : Atom
    {
        public
        abstract    string          type    { get; }
        public      List<Action>    actions;
    }

    public
    abstract    class   Property<T> : Property
    {
        public  T               value;
    }

}}}
