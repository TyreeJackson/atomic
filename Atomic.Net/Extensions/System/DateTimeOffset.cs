namespace AtomicNet
{

    public
    static  class   DateTimeOffsetExtensions
    {

        public  static  double  ConvertToEpoch(this DateTimeOffset value)   { return (value.ToUniversalTime() - DateTimeOffset.nineteenSeventyDate).TotalMilliseconds; }

    }

}
