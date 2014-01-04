using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
