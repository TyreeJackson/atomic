using System;
using System.Runtime.Serialization;

namespace AtomicNet
{
    [Serializable]
    public  class UndefinedException : Exception
    {

        public      UndefinedException()                                                    : base()                        {}
        public      UndefinedException(string message)                                      : base(message)                 {}
        public      UndefinedException(string message, Exception innerException)            : base(message, innerException) {}
        protected   UndefinedException(SerializationInfo info, StreamingContext context)    : base(info, context)           {}

    }
}