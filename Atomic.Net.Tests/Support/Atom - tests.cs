using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace AtomicNet.tests
{

    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverage]
    public  class   TestAtom : Atom<TestAtom> {}

    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverage]
    public  class   SubTestAtom : TestAtom {}

    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverage]
    [TestClass]
    public  class   AtomTests {}

}
