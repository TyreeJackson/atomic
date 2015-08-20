using System;
using System.ComponentModel;

namespace AtomicNet
{

    public
    abstract    class   Atom
    {

        protected
        static      readonly    undefined   undefined   = undefined.value;

        [EditorBrowsable(EditorBrowsableState.Never)]
        [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverage]
        public      override    bool        Equals(object obj)                          { return base.Equals(obj); }

        [EditorBrowsable(EditorBrowsableState.Never)]
        [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverage]
        public      override    int         GetHashCode()                               { return base.GetHashCode(); }

        [EditorBrowsable(EditorBrowsableState.Never)]
        [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverage]
        public      override    string      ToString()                                  { return base.ToString(); }

        [EditorBrowsable(EditorBrowsableState.Never)]
        [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverage]
        public      new         Type        GetType()                                   { return base.GetType(); }

        [EditorBrowsable(EditorBrowsableState.Never)]
        [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverage]
        protected   new         object      MemberwiseClone()                           { return base.MemberwiseClone(); }

        [EditorBrowsable(EditorBrowsableState.Never)]
        [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverage]
        public      new static  bool        Equals(object objA, object objB)            { return Object.Equals(objA, objB); }

        [EditorBrowsable(EditorBrowsableState.Never)]
        [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverage]
        public      new static  bool        ReferenceEquals(object objA, object objB)   { return Object.ReferenceEquals(objA, objB); }

    }

    public
    abstract    class   Atom<tAtom>
    :
                        Atom 

                where   tAtom   : Atom<tAtom>
    {
    }

}
