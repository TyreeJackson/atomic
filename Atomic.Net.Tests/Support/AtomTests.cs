using System;
using AtomicNet;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace AtomicNetTests
{

    public  class   TestAtom : Atom<TestAtom> {}

    public  class   SubTestAtom : TestAtom {}

    [TestClass]
    public  class   AtomTests {}

}
