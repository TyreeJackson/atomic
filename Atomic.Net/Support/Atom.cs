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
                .AndPushNewObjectOntoStack(type.GetConstructor(Type.EmptyTypes))
                .AndReturnObject();
                _creator    = (creatorDelegate) method.CreateDelegate(typeof(creatorDelegate));
            }

            public
            static              tSubAtom        Create()        { return TypeContext<tSubAtom>.creator(); }

        }

        public
        static  tAtom       Create()                                        { return TypeContext<tAtom>.Create(); }

        //public
        //static  tAtom       Create(Type type)                               { return (tAtom) System.Activator.CreateInstance(type); }

        public
        static  tSubAtom    Create<tSubAtom>()                              where tSubAtom : tAtom
        {
            return TypeContext<tSubAtom>.Create();
        }

        public
        static  tAtom       CreateIfNeeded(ref tAtom item)                  { return item == null ? item = Atom<tAtom>.Create() : item; }

        public
        static  tSubAtom    CreateIfNeeded<tSubAtom>(ref tSubAtom item)     where tSubAtom : tAtom
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
        static  class   TypeContext<tSubAtom, tSubArg>
                where   tSubAtom    : tAtom
                where   tSubArg     : tArg
        {

            private delegate    tSubAtom        creatorDelegate(tSubArg arg);

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
                    TypeContext<tSubAtom, tSubArg>.setCreator();

                    return _creator;
                }
            }

            private
            static              void            setCreator()
            {
                DynamicMethod   method  = new DynamicMethod("CreateIntance", type, new Type[] {typeof(tSubArg)});
                method.GetILGenerator()
                .AndPushArgument0OntoStack()
                .AndPushNewObjectOntoStack(type.GetConstructor(System.Reflection.BindingFlags.Public|System.Reflection.BindingFlags.NonPublic|System.Reflection.BindingFlags.Instance, null, new Type[] {typeof(tSubArg)}, null))
                .AndReturnObject();
                _creator    = (creatorDelegate) method.CreateDelegate(typeof(creatorDelegate));
            }

            public
            static              tSubAtom        Create(tSubArg arg)    { return TypeContext<tSubAtom, tSubArg>.creator(arg); }

        }

        public
        static  tAtom       Create(tArg arg)                                        { return TypeContext<tAtom, tArg>.Create(arg); }

        public
        static  tSubAtom    Create<tSubAtom, tSubArg>(tSubArg arg)
        where               tSubAtom                                : tAtom
        where               tSubArg                                 : tArg
        {
            return TypeContext<tSubAtom, tSubArg>.Create(arg);
        }

        public
        static  tAtom       CreateIfNeeded(ref tAtom item, tArg arg)                { return item == null ? item = Atom<tAtom, tArg>.Create(arg) : item; }

        public
        static  tSubAtom    CreateIfNeeded<tSubAtom, tSubArg>(ref tSubAtom item, tSubArg arg)
        where               tSubAtom                                                            : tAtom
        where               tSubArg                                                             : tArg
        {
            return item == null ? item = Atom<tAtom, tArg>.Create<tSubAtom, tSubArg>(arg) : item;
        }

        protected           Atom(tArg arg) {}

    }

}
