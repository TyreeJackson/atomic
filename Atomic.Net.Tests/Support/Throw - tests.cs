using System;
using AtomicNet;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace AtomicNetTests
{

    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverage]
    [TestClass]
    public class ThrowTests
    {

        [TestMethod]
        [ExpectedException(typeof(InvalidOperationException))]
        public  void    When_conditionally_throwing_an_exception_if_the_condition_is_true_then_the_exception_should_be_thrown()
        {
            Throw<InvalidOperationException>.If(true);
        }

        [TestMethod]
        public  void    When_conditionally_throwing_an_exception_if_the_condition_is_false_then_the_exception_should_not_be_thrown()
        {
            Throw<InvalidOperationException>.If(false);
        }

        [TestMethod]
        [ExpectedException(typeof(InvalidOperationException))]
        public  void    When_conditionally_throwing_an_exception_if_the_condition_is_false_but_the_second_condition_is_true_then_throw_the_exception()
        {
            Throw<InvalidOperationException>.If(false).OrIf(true);
        }

        [TestMethod]
        public  void    When_conditionally_throwing_an_exception_if_the_condition_is_false_and_the_second_condition_is_false_then_the_exception_should_not_be_thrown()
        {
            Throw<InvalidOperationException>.If(false).OrIf(false);
        }

        [TestMethod]
        [ExpectedException(typeof(InvalidOperationException), "Test Exception")]
        public  void    When_conditionally_throwing_an_exception_with_arg_if_the_condition_is_true_then_the_exception_should_be_thrown()
        {
            Throw<InvalidOperationException>.If(true, "Test Exception");
        }

        [TestMethod]
        public  void    When_conditionally_throwing_an_exception_with_arg_if_the_condition_is_false_then_the_exception_should_not_be_thrown()
        {
            Throw<InvalidOperationException>.If(false);
        }

        [TestMethod]
        [ExpectedException(typeof(InvalidOperationException), "Test Exception")]
        public  void    When_conditionally_throwing_an_exception_with_arg_if_the_condition_is_false_but_the_second_condition_is_true_then_throw_the_exception()
        {
            Throw<InvalidOperationException>.If(false).OrIf(true, "Test Exception");
        }

        [TestMethod]
        public  void    When_conditionally_throwing_an_exception_with_arg_if_the_condition_is_false_and_the_second_condition_is_false_then_the_exception_should_not_be_thrown()
        {
            Throw<InvalidOperationException>.If(false).OrIf(false);
        }

    }

}
