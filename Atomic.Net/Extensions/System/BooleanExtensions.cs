using System;

namespace AtomicNet
{

    public
    static  class   BooleanExtensions
    {

        public  static  void    then(this bool providedThat, Action proceedWith)
        {
            if (providedThat)   proceedWith();
        }

    }

}
