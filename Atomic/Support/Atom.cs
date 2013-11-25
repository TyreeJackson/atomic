using System;
using System.ComponentModel;

namespace AtomicStack
{

    public  class   Atom
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

    public  class   Atom<tAtom, tSubAtom>
    :
                    Atom 
            where   tAtom           : Atom<tAtom, tSubAtom>
            where   tSubAtom        : tAtom
    {

        public  class   FactoryLocatorClass
        {

            public  t   Create<t>() where t : tAtom
            {
                throw new NotImplementedException();
            }

            public  t   Create<t, tArg>(tArg arg) where t : tAtom
            {
                throw new NotImplementedException();
            }

        }

        public  
        static  readonly    FactoryLocatorClass FactoryLocator  = new FactoryLocatorClass();

        public
        static              t                   CreateIfNeeded<t, tArg>(ref t item, tArg arg) where t : tSubAtom
        {
            return  item == null
                    ?   item = Atom<tAtom, tSubAtom>.FactoryLocator.Create<t, tArg>(arg)
                    :   item;
        }

    }

    public  class   Atom<tAtom>
    :
                    Atom<tAtom, tAtom>
            where   tAtom           : Atom<tAtom>
    {
    }

}
