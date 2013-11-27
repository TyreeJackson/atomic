using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AtomicNet
{

    public
    abstract    class   AtomicService : Atom<AtomicService>
    {
        public
        abstract    bool    IsReusable  { get; }
    }

}
