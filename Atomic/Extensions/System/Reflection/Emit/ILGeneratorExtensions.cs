using System;
using System.Reflection;
using System.Reflection.Emit;

namespace AtomicStack
{

    public  static  class   ILGeneratorExtensions
    {

        public  static  ILGenerator AndEmit(this ILGenerator generator, OpCode opCode)                          { generator.Emit(opCode);  return generator; }
        public  static  ILGenerator AndEmit(this ILGenerator generator, OpCode opCode, int arg)                 { generator.Emit(opCode, arg);  return generator; }
        public  static  ILGenerator AndEmit(this ILGenerator generator, OpCode opCode, Label arg)               { generator.Emit(opCode, arg);  return generator; }
        public  static  ILGenerator AndEmit(this ILGenerator generator, OpCode opCode, ConstructorInfo arg)     { generator.Emit(opCode, arg);  return generator; }
        public  static  ILGenerator AndEmit(this ILGenerator generator, OpCode opCode, MethodInfo arg)          { generator.Emit(opCode, arg);  return generator; }
        public  static  ILGenerator AndEmit(this ILGenerator generator, OpCode opCode, Type arg)                { generator.Emit(opCode, arg);  return generator; }
        public  static  ILGenerator AndPushArgument0OntoStack(this ILGenerator generator)                       { return generator.AndEmit(OpCodes.Ldarg_0);}
        public  static  ILGenerator AndPushArgument1OntoStack(this ILGenerator generator)                       { return generator.AndEmit(OpCodes.Ldarg_1);}
        public  static  ILGenerator AndPushArgument2OntoStack(this ILGenerator generator)                       { return generator.AndEmit(OpCodes.Ldarg_2);}
        public  static  ILGenerator AndPushArgument3OntoStack(this ILGenerator generator)                       { return generator.AndEmit(OpCodes.Ldarg_3);}
        public  static  ILGenerator AndPushArgumentSOntoStack(this ILGenerator generator)                       { return generator.AndEmit(OpCodes.Ldarg_S);}
        public  static  ILGenerator AndPushArrayLengthOntoStack(this ILGenerator generator)                     { return generator.AndEmit(OpCodes.Ldlen);}
        public  static  ILGenerator AndPushInt32AsInt32OntoStack(this ILGenerator generator, int arg)           { return generator.AndEmit(OpCodes.Ldc_I4, arg);}
        public  static  ILGenerator AndPushNewObjectOntoStack(this ILGenerator generator, ConstructorInfo arg)  { return generator.AndEmit(OpCodes.Newobj, arg); }
        public  static  ILGenerator AndThrowExceptionFromStack(this ILGenerator generator)                      { return generator.AndEmit(OpCodes.Throw); }
        public  static  ILGenerator AndGotoLabelIfTrue(this ILGenerator generator, Label arg)                   { return generator.AndEmit(OpCodes.Beq, arg);}
        public  static  ILGenerator AndReturnObject(this ILGenerator generator)                                 { return generator.AndEmit(OpCodes.Ret);}
        public  static  ILGenerator AndDefineLabel(this ILGenerator generator, Label label)                     { generator.MarkLabel(label); return generator; }
        public  static  ILGenerator AndPushElementFromArrayAtIndexOnStackOntoStack(this ILGenerator generator)  { return generator.AndEmit(OpCodes.Ldelem_Ref); }
        public  static  ILGenerator AndUnboxArgument(this ILGenerator generator, Type parameterType)            { return generator.AndEmit(OpCodes.Unbox_Any, parameterType); }
        public  static  ILGenerator AndInvokeMethodOnObject(this ILGenerator generator, MethodInfo method)      { return generator.AndEmit(method.IsFinal ? OpCodes.Call : OpCodes.Callvirt, method); }

        public  static  ILGenerator CheckArgumentCount(this ILGenerator generator, ParameterInfo[] parameters)
        {
            Label   argsGood    = generator.EnsureCorrectNumberOfArgumentsHaveBeenSupplied(parameters);

            return
            generator
            .ThrowException<TargetParameterCountException>()
            .AndDefineLabel(argsGood);
        }

        public  static  Label EnsureCorrectNumberOfArgumentsHaveBeenSupplied(this ILGenerator generator, ParameterInfo[] parameters)
        {
            Label   argsGood    = generator.DefineLabel();

            generator
            .AndPushArgument1OntoStack()
            .AndPushArrayLengthOntoStack()
            .AndPushInt32AsInt32OntoStack(parameters.Length)
            .AndGotoLabelIfTrue(argsGood);

            return argsGood;
        }

        public  static  ILGenerator ThrowException<tException>(this ILGenerator generator) where tException : Exception
        {
            return
            generator
            .AndPushNewObjectOntoStack(typeof(tException).GetConstructor(Type.EmptyTypes))
            .AndThrowExceptionFromStack();
        }

        public  static  ILGenerator AndUnboxValueTypeArgument(this ILGenerator generator, Type parameterType)    { return parameterType.IsValueType ? generator.AndUnboxArgument(parameterType) : generator; }

        public  static  ILGenerator ReturnNewObjectFromConstructorWithArguments(this ILGenerator generator, ConstructorInfo constructor, ParameterInfo[] parameters)
        {
            return
            generator
            .PushArgumentsOntoStack(parameters)
            .AndPushNewObjectOntoStack(constructor)
            .AndReturnObject();
        }

        public  static  ILGenerator PushInstanceTargetOntoStack(this ILGenerator generator, MethodInfo method)
        {
            return !method.IsStatic ? generator.AndPushArgument0OntoStack() : generator;
        }

        public  static  ILGenerator ReturnFromMethodOnObject(this ILGenerator generator, MethodInfo method)
        {
            if (typeof(void) == method.ReturnType)  generator.AndEmit(OpCodes.Ldnull);
            else if (method.ReturnType.IsValueType) generator.AndEmit(OpCodes.Box, method.ReturnType);

            return generator.AndReturnObject();
        }

        public  static  ILGenerator InvokeMethod(this ILGenerator generator, MethodInfo method, ParameterInfo[] parameters)
        {
            return
            generator
            .PushInstanceTargetOntoStack(method)
            .PushArgumentsOntoStack(parameters)
            .AndInvokeMethodOnObject(method)
            .ReturnFromMethodOnObject(method);
        }

        public  static  ILGenerator PushArgumentsOntoStack(this ILGenerator generator, ParameterInfo[] parameters)
        {
            for (int i = 0; i < parameters.Length; i++)
            {
                generator.AndPushArgument1OntoStack()
                .AndPushInt32AsInt32OntoStack(i)
                .AndPushElementFromArrayAtIndexOnStackOntoStack();

                generator.AndUnboxValueTypeArgument(parameters[i].ParameterType);
            }
            return  generator;
        }

    }

}
