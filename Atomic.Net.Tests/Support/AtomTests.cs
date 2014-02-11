using System;
using AtomicNet;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace AtomicNetTests
{

    public  class   TestAtom : Atom<TestAtom> {}

    public  class   SubTestAtom : TestAtom {}

    [TestClass]
    public class AtomTests
    {

        [TestMethod]
        public  void    WhenCreatingAnAtomUsingStaticCreateAnAtomInstanceShouldBeCreated()
        {
            Assert.IsNotNull(TestAtom.Create());
        }

        [TestMethod]
        public  void    WhenCreatingASubAtomUsingStaticCreateASubAtomIntanceShouldBeCreated()
        {
            Assert.IsNotNull(TestAtom.Create<SubTestAtom>());
        }

        [TestMethod]
        public  void    WhenWrappingANullAtomUsingStaticCreateIfNeededAnAtomInstanceShouldBeCreated()
        {
            TestAtom    testAtom    = null;
            Assert.IsNotNull(TestAtom.CreateIfNeeded(ref testAtom));
            Assert.IsNotNull(testAtom);
        }

        [TestMethod]
        public  void    WhenWrappingANullSubAtomUsingStaticCreateIfNeededASubAtomInstanceShouldBeCreated()
        {
            SubTestAtom subTestAtom = null;
            Assert.IsNotNull(TestAtom.CreateIfNeeded<SubTestAtom>(ref subTestAtom));
            Assert.IsNotNull(subTestAtom);
        }

    }

    public  class   TestAtomWithArg : Atom<TestAtomWithArg, TestAtomWithArg.Arg>
    {

        public  class   Arg {}

        public  Arg arg { get; private set; }

        public  TestAtomWithArg(Arg arg) : base(arg) { this.arg = arg; }

    }

    public  class   SubTestAtomWithArg : TestAtomWithArg
    {

        public  SubTestAtomWithArg(Arg arg) : base(arg) {}

    }

    [TestClass]
    public class AtomWithArgsTests
    {

        [TestMethod]
        public  void    WhenCreatingAnAtomUsingStaticCreateAnAtomInstanceShouldBeCreated()
        {
            Assert.IsNotNull(TestAtomWithArg.Create(new TestAtomWithArg.Arg()));
        }

        [TestMethod]
        public  void    WhenCreatingASubAtomUsingStaticCreateASubAtomIntanceShouldBeCreated()
        {
            Assert.IsNotNull(TestAtomWithArg.Create<SubTestAtomWithArg, TestAtomWithArg.Arg>(new TestAtomWithArg.Arg()));
        }

        [TestMethod]
        public  void    WhenWrappingANullAtomUsingStaticCreateIfNeededAnAtomInstanceShouldBeCreated()
        {
            TestAtomWithArg testAtom    = null;
            Assert.IsNotNull(TestAtomWithArg.CreateIfNeeded(ref testAtom, new TestAtomWithArg.Arg()));
            Assert.IsNotNull(testAtom);
        }

        [TestMethod]
        public  void    WhenWrappingANullSubAtomUsingStaticCreateIfNeededASubAtomInstanceShouldBeCreated()
        {
            SubTestAtomWithArg  subTestAtom = null;
            Assert.IsNotNull(TestAtomWithArg.CreateIfNeeded<SubTestAtomWithArg, TestAtomWithArg.Arg>(ref subTestAtom, new TestAtomWithArg.Arg()));
            Assert.IsNotNull(subTestAtom);
        }

    }

}
