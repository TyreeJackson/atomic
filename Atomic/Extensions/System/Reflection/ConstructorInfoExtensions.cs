using System;
using System.Reflection;
using System.Reflection.Emit;
using AtomicStack.Dependencies.PublicDomain;

namespace AtomicStack
{

    public  static  class   ConstructorInfoExtensions
    {

        public  static  DynamicMethodFactory.DynamicMethodDelegate  CreateDelegateForConstructor(this ConstructorInfo constructor)
        {
            ParameterInfo[] parameters  = constructor.GetParameters();
            DynamicMethod   dMethod     = new DynamicMethod(String.Empty, typeof(object), new Type[] { typeof(object), typeof(object[]) }, typeof(DynamicMethodFactory), false);

            dMethod
            .GetILGenerator()
            .CheckArgumentCount(parameters)
            .ReturnNewObjectFromConstructorWithArguments(constructor, parameters);

            return (DynamicMethodFactory.DynamicMethodDelegate)dMethod.CreateDelegate(typeof(DynamicMethodFactory.DynamicMethodDelegate));
        }

    }

}
