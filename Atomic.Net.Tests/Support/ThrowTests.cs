using System;
using AtomicNet;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace AtomicNetTests
{

    [TestClass]
    public class ThrowTests
    {

        [TestMethod]
        [ExpectedException(typeof(InvalidOperationException))]
        public  void    WhenConditionallyThrowingAnExceptionIfTheConditionIsTrueThenTheExceptionShouldBeThrown()
        {
            Throw<InvalidOperationException>.If(true);
        }

        [TestMethod]
        public  void    WhenConditionallyThrowingAnExceptionIfTheConditionIsFalseThenTheExceptionShouldNotBeThrown()
        {
            Throw<InvalidOperationException>.If(false);
        }

        [TestMethod]
        [ExpectedException(typeof(InvalidOperationException))]
        public  void    WhenConditionallyThrowingAnExceptionIfTheConditionIsFalseButTheSecondConditionIsTrueThenThrowTheException()
        {
            Throw<InvalidOperationException>.If(false).OrIf(true);
        }

        [TestMethod]
        public  void    WhenConditionallyThrowingAnExceptionIfTheConditionIsFalseAndTheSecondConditionIsFalseThenTheExceptionShouldNotBeThrown()
        {
            Throw<InvalidOperationException>.If(false).OrIf(false);
        }

        [TestMethod]
        [ExpectedException(typeof(InvalidOperationException), "Test Exception")]
        public  void    WhenConditionallyThrowingAnExceptionWithArgIfTheConditionIsTrueThenTheExceptionShouldBeThrown()
        {
            Throw<InvalidOperationException>.If(true, "Test Exception");
        }

        [TestMethod]
        public  void    WhenConditionallyThrowingAnExceptionWithArgIfTheConditionIsFalseThenTheExceptionShouldNotBeThrown()
        {
            Throw<InvalidOperationException>.If(false);
        }

        [TestMethod]
        [ExpectedException(typeof(InvalidOperationException), "Test Exception")]
        public  void    WhenConditionallyThrowingAnExceptionWithArgIfTheConditionIsFalseButTheSecondConditionIsTrueThenThrowTheException()
        {
            Throw<InvalidOperationException>.If(false).OrIf(true, "Test Exception");
        }

        [TestMethod]
        public  void    WhenConditionallyThrowingAnExceptionWithArgIfTheConditionIsFalseAndTheSecondConditionIsFalseThenTheExceptionShouldNotBeThrown()
        {
            Throw<InvalidOperationException>.If(false).OrIf(false);
        }

    }

}
