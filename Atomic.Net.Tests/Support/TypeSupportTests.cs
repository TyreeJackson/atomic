using System;
using AtomicNet;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace AtomicNetTests
{

    [TestClass]
    public class TypeSupportTests<t>
    {

        [TestMethod]
        public  void    WhenGettingTheTypeFromTypeSupportItShouldMatchTypeOf()
        {
            Assert.AreEqual(typeof(t), TypeSupport<t>.type);
        }

        [TestMethod]
        public  void    WhenGettingTheNameFromTypeSupportItShouldMatchTypeOfName()
        {
            Assert.AreEqual(typeof(t).Name, TypeSupport<t>.Name);
        }

        [TestMethod]
        public  void    WhenGettingTheFullNameFromTypeSupportItShouldMatchTypeOfFullName()
        {
            Assert.AreEqual(typeof(t).Name, TypeSupport<t>.Name);
        }

        [TestMethod]
        public  void    WhenCreatingAnInstanceFromTypeSupportItShouldNotBeNull()
        {
            Assert.IsNotNull(TypeSupport<t>.Create());
        }

    }

    [TestClass]
    public  class   ExceptionTypeSupportTests : TypeSupportTests<Exception> {}

    [TestClass]
    public  class   StringBuilderTypeSupportTests : TypeSupportTests<System.Text.StringBuilder> {}

}
