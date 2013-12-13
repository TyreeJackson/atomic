using System;
using AtomicNet;
using System.ComponentModel;
using System.Reflection.Emit;

namespace AtomicNet
{

    public
    class   TypeSupport<t>
    {

        private
        static  class   TypeContext
        {

            private delegate    t               creatorDelegate();

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
                    TypeContext.setCreator();

                    return _creator;
                }
            }

            private
            static              void            setCreator()
            {
                DynamicMethod   method  = new DynamicMethod("CreateIntance", TypeSupport<t>.type, Type.EmptyTypes);
                method.GetILGenerator()
                .AndPushNewObjectOntoStack(TypeSupport<t>.type.GetConstructor(Type.EmptyTypes))
                .AndReturnObject();
                _creator    = (creatorDelegate) method.CreateDelegate(typeof(creatorDelegate));
            }

            public
            static              t               Create()        { return TypeContext.creator(); }

        }

        private
        static  class   TypeContext<tArg>
        {

            private delegate    t               creatorDelegate(tArg arg);

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
                    TypeContext<tArg>.setCreator();

                    return _creator;
                }
            }

            private
            static              void            setCreator()
            {
                DynamicMethod   method  = new DynamicMethod("CreateIntance", TypeSupport<t>.type, new Type[] {typeof(tArg)});
                method.GetILGenerator()
                .AndPushArgument0OntoStack()
                .AndPushNewObjectOntoStack(TypeSupport<t>.type.GetConstructor(System.Reflection.BindingFlags.Public|System.Reflection.BindingFlags.NonPublic|System.Reflection.BindingFlags.Instance, null, new Type[] {typeof(tArg)}, null))
                .AndReturnObject();
                _creator    = (creatorDelegate) method.CreateDelegate(typeof(creatorDelegate));
            }

            public
            static              t               Create(tArg arg)        { return TypeContext<tArg>.creator(arg); }

        }

        public
        static
        readonly    System.Type type                    = typeof(t);

        public
        static      string      Name                    { get { return TypeSupport<t>.type.Name; } }

        public
        static      t           Create()                { return TypeContext.Create(); }

        public
        static      t           Create<tArg>(tArg arg)  { return TypeContext<tArg>.Create(arg); }

    }

}
