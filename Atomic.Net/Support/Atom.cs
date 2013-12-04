using System;
using System.ComponentModel;
using System.Reflection.Emit;

namespace AtomicNet
{

    public      class   Atom
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
                where   tAtom   : Atom<tAtom>
    {

        private
        static  class   TypeContext<tSubAtom>
                where   tSubAtom    : tAtom
        {

            private delegate    tSubAtom        creatorDelegate();

            private
            static
            readonly            Type            type            = typeof(tSubAtom);

            private
            static              creatorDelegate _creator;

            private
            static              object          creatorLock     = new object();

            private
            static              creatorDelegate creator
            {
                get
                {
                    if (_creator == null)
                    lock(creatorLock)
                    if (_creator == null)
                    TypeContext<tSubAtom>.setCreator();

                    return _creator;
                }
            }

            private
            static              void            setCreator()
            {
                DynamicMethod   method  = new DynamicMethod("CreateIntance", type, Type.EmptyTypes);
                method.GetILGenerator()
                .AndPushArgument0OntoStack()
                .AndPushNewObjectOntoStack(type.GetConstructor(Type.EmptyTypes))
                .AndReturnObject();
                _creator    = (creatorDelegate) method.CreateDelegate(typeof(creatorDelegate));
            }

            public
            static              tSubAtom        Create()        { return TypeContext<tSubAtom>.creator(); }

        }

        public
        static  tAtom   Create()                                        { return TypeContext<tAtom>.Create(); }

        public
        static  tSubAtom    Create<tSubAtom>()                          where tSubAtom : tAtom
        {
            return TypeContext<tSubAtom>.Create();
        }

        public
        static  tAtom   CreateIfNeeded(ref tAtom item)                  { return item == null ? item = Atom<tAtom>.Create() : item; }

        public
        static  tSubAtom    CreateIfNeeded<tSubAtom>(ref tSubAtom item) where tSubAtom : tAtom
        {
            return item == null ? item = Atom<tAtom>.Create<tSubAtom>() : item;
        }

    }

    public
    abstract    class   Atom<tAtom, tArg>
    :
                        Atom 
                where   tAtom   : Atom<tAtom, tArg>
    {

        private
        static  class   TypeContext<tSubAtom>
                where   tSubAtom    : tAtom
        {

            private delegate    tSubAtom        creatorDelegate(tArg arg);

            private
            static
            readonly            Type            type                = typeof(tSubAtom);

            private
            static              creatorDelegate _creator;

            private
            static              object          creatorLock         = new object();

            private
            static              creatorDelegate creator
            {
                get
                {
                    if (_creator == null)
                    lock(creatorLock)
                    if (_creator == null)
                    TypeContext<tSubAtom>.setCreator();

                    return _creator;
                }
            }

            private
            static              void            setCreator()
            {
                DynamicMethod   method  = new DynamicMethod("CreateIntance", type, Type.EmptyTypes);
                method.GetILGenerator()
                .AndPushArgument0OntoStack()
                .AndPushNewObjectOntoStack(type.GetConstructor(Type.EmptyTypes))
                .AndReturnObject();
                _creator    = (creatorDelegate) method.CreateDelegate(typeof(creatorDelegate));
            }

            public
            static              tSubAtom        Create(tArg arg)    { return TypeContext<tSubAtom>.creator(arg); }

        }

        public
        static  tAtom       Create(tArg arg)                                        { return TypeContext<tAtom>.Create(arg); }

        public
        static  tSubAtom    Create<tSubAtom>(tArg arg)                              where tSubAtom : tAtom
        {
            return TypeContext<tSubAtom>.Create(arg);
        }

        public
        static  tAtom       CreateIfNeeded(ref tAtom item, tArg arg)                { return item == null ? item = Atom<tAtom, tArg>.Create(arg) : item; }

        public
        static  tSubAtom    CreateIfNeeded<tSubAtom>(ref tSubAtom item, tArg arg)   where tSubAtom : tAtom
        {
            return item == null ? item = Atom<tAtom, tArg>.Create<tSubAtom>(arg) : item;
        }

        protected           Atom(tArg arg) {}

    }

}
