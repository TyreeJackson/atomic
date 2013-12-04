using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AtomicNet
{

    public  class   TypeExtensions
    {

        protected   class   TypeSupport<T>
        {
            private static  readonly    Type    type    = typeof(T);

            public  T   Create()
            {
                #warning NotImplemented
                throw new NotImplementedException();
            }

        }

        public  T   Create<T>()
        {
            #warning NotImplemented
            throw new NotImplementedException();
        }

    }

}
