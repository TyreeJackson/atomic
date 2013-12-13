using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AtomicNet
{

    public
    abstract    class   HostContext : Atom<HostContext>
    {

        public  static  HostContext         Current             { get { return HostContext.instance; } }

        [ThreadStatic]
        private static  HostContext         instance;

        public
        abstract        Exception[]         AllErrors           { get; }

        public
        abstract        HostApplication     ApplicationInstance { get; }

        public
        abstract        Exception           Error               { get; }

        public
        abstract        HostHandler         Handler             { get; }

        public
        abstract        HostRequest         Request             { get; }

        public
        abstract        HostResponse        Response            { get; }

        public
        abstract        HostServerUtility   Server              { get; }

        public
        abstract        DateTime            Timestamp           { get; }

        public
        abstract        HostPrincipal       User                { get; }

        public                              HostContext()       { HostContext.instance = this; }

    }

}
