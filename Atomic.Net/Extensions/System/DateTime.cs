using System;

namespace AtomicNet
{

    public
    static  class   DateTimeExtensions
    {

        public
        static
        readonly    DateTime    nineteenSeventyDate = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);

        public  static  double  ConvertToEpoch(this System.DateTime value)  { return (value.ToUniversalTime() - DateTimeExtensions.nineteenSeventyDate).TotalMilliseconds; }

    }

}
