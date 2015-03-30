using System;
using System.ComponentModel;
using System.Reflection.Emit;

namespace AtomicNet
{

    public
    abstract    class   Atom
    {

        [EditorBrowsable(EditorBrowsableState.Never)]
        public      override    bool    Equals(object obj)                          { return base.Equals(obj); }

        [EditorBrowsable(EditorBrowsableState.Never)]
        public      override    int     GetHashCode()                               { return base.GetHashCode(); }

        [EditorBrowsable(EditorBrowsableState.Never)]
        public      override    string  ToString()                                  { return base.ToString(); }

        [EditorBrowsable(EditorBrowsableState.Never)]
        public      new         Type    GetType()                                   { return base.GetType(); }

        [EditorBrowsable(EditorBrowsableState.Never)]
        protected   new         object  MemberwiseClone()                           { return base.MemberwiseClone(); }

        [EditorBrowsable(EditorBrowsableState.Never)]
        public      new static  bool    Equals(object objA, object objB)            { return Object.Equals(objA, objB); }

        [EditorBrowsable(EditorBrowsableState.Never)]
        public      new static  bool    ReferenceEquals(object objA, object objB)   { return Object.ReferenceEquals(objA, objB); }

    }

    public
    abstract    class   Atom<tAtom>
    :
                        Atom 

                where   tAtom   : Atom<tAtom> {}

    public
    abstract    class   DIAtom<tAtom, tHooks>
    :
                        Atom 
                where   tAtom   : DIAtom<tAtom, tHooks>
                where   tHooks  : DIAtom<tAtom, tHooks>.BaseHooks
    {

        public
        abstract    class   BaseHooks {}

        protected           DIAtom() {}

    }

}
