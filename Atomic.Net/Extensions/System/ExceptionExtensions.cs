using System;

namespace AtomicNet
{

    public
    static  class   ExceptionExtensions
    {

        public  static  void    Throw(this Exception exception)
        {
            if (exception == null)  throw new Exception("An unknown error has occurred.");

            System.Runtime.ExceptionServices
            .ExceptionDispatchInfo.Capture
            (
                exception is PromiseException
                ?   exception.InnerException
                :   exception
            ).Throw();
        }

    }

}
