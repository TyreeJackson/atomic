using System;
using AtomicNet;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace AtomicNetTests
{

    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverage]
    [TestClass]
    public 
    abstract    class   TypeSupportTests<t>
    {

        [TestMethod]
        public  void    When_getting_the_Type_from_TypeSupport_it_should_match_typeof()
        {
            Assert.AreEqual(typeof(t), TypeSupport<t>.type);
        }

        [TestMethod]
        public  void    When_getting_the_Name_from_TypeSupport_it_should_match_typeof_Name()
        {
            Assert.AreEqual(typeof(t).Name, TypeSupport<t>.Name);
        }

        [TestMethod]
        public  void    When_getting_the_FullName_from_TypeSupport_it_should_match_typeof_FullName()
        {
            Assert.AreEqual(typeof(t).FullName, TypeSupport<t>.FullName);
        }

        [TestMethod]
        public  void    When_creating_an_instance_from_TypeSupport_it_should_not_be_null()
        {
            Assert.IsNotNull(TypeSupport<t>.Create());
        }

    }

    [TestClass]
    public  class   ExceptionTypeSupportTests : TypeSupportTests<Exception> {}

    [TestClass]
    public  class   StringBuilderTypeSupportTests : TypeSupportTests<System.Text.StringBuilder> {}

}
