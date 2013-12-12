using System;
using System.ComponentModel;

namespace AtomicNet
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
                #warning NotImplemented
                throw new NotImplementedException();
            }

            public  tException  Create<tArg>(tArg arg)
            {
                #warning NotImplemented
                throw new NotImplementedException();
            }

        }

        public  
        static  readonly    ExceptionFactoryLocatorClass    ExceptionFactoryLocator = new ExceptionFactoryLocatorClass();

        public  static      void                If(bool condition)                  { if (condition)    throw ExceptionFactoryLocator.Create(); }

        public  static      void                If<tArg>(bool condition, tArg arg)  { if (condition)    throw ExceptionFactoryLocator.Create(arg); }

    }

}
