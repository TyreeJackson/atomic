using System;
using System.ComponentModel;

namespace AtomicStack
{

    public  class   Throw<tException>
    :
                    Atom<Throw<tException>>
            where   tException  : Exception
    {

        public  class   ExceptionFactoryLocatorClass
        {

            public  tException  Create()
            {
                throw new NotImplementedException();
            }

            public  tException  Create<tArg>(tArg arg)
            {
                throw new NotImplementedException();
            }

        }

        public  
        static  readonly    ExceptionFactoryLocatorClass    ExceptionFactoryLocator = new ExceptionFactoryLocatorClass();

        public  static      void                If(bool condition)                  { throw ExceptionFactoryLocator.Create(); }

        public  static      void                If<tArg>(bool condition, tArg arg)  { throw ExceptionFactoryLocator.Create(arg); }

    }

}
