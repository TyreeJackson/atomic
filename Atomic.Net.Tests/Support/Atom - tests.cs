using System;
using AtomicNet;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace AtomicNetTests
{

    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverage]
    public  class   TestAtom : Atom<TestAtom> {}

    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverage]
    public  class   SubTestAtom : TestAtom {}

    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverage]
    [TestClass]
    public  class   AtomTests {}

}
