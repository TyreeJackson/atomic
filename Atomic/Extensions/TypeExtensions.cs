using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AtomicStack
{

    public  class   TypeExtensions
    {

        protected   class   TypeSupport<T>
        {
            private static  readonly    Type    type    = typeof(T);

            public  T   Create()
            {
                return default(T);
            }

        }

        public  T   Create<T>()
        {
            return default(T);
        }

    }

}
