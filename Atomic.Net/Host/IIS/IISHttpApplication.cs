using System;

namespace AtomicNet.IIS
{

    public  class IISHttpApplication : HostApplication
    {

        public      IISHttpApplication(HostContext context) : base(context) {}

        [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverage]
        [Obsolete("This constructor is for mocking purposes only.")]
        internal    IISHttpApplication() : this(null) {}

    }

}
