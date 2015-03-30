using System.Linq;
using AtomicNet;

namespace AtomicNet
{

    public
    abstract
    partial
    class       Configuration : Atom<Configuration>
    {

        public
        static  Configuration           Config;

        public  int                     TimeShift;

    }

}
