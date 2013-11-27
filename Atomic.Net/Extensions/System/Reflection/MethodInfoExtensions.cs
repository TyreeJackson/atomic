using System;
using System.Reflection;
using System.Reflection.Emit;
using AtomicNet.Dependencies.PublicDomain;

namespace AtomicNet
{

    public  static  class   MethodInfoExtensions
    {

        public  static  DynamicMethodFactory.DynamicMethodDelegate  CreateDelegateForMethod(this MethodInfo method)
        {
            ParameterInfo[] parameters  = method.GetParameters();
            DynamicMethod   dMethod     = new DynamicMethod(String.Empty, typeof(object), new Type[] { typeof(object), typeof(object[]) }, typeof(DynamicMethodFactory), false);

            dMethod
            .GetILGenerator()
            .CheckArgumentCount(parameters)
            .InvokeMethod(method, parameters);

            return (DynamicMethodFactory.DynamicMethodDelegate)dMethod.CreateDelegate(typeof(DynamicMethodFactory.DynamicMethodDelegate));
        }

    }

}
