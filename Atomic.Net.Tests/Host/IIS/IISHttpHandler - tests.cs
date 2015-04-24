using System;
using System.Web;
using AtomicNet.IIS;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace AtomicNet.tests
{

    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverage]
    [TestClass]
    public class IISHttpHandlerTests
    {

        private Mock<WebHandler.Router> mockRouter;

        [TestInitialize]
        public  void    Initialize()
        {
            this.mockRouter = new Mock<WebHandler.Router>();
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentNullException))]
        public  void    When_constructing_an_IISHttpHandler_the_router_argument_must_not_be_null()
        {
            var handler = new IISHttpHandler(null);
        }

        [TestMethod]
        [ExpectedException(typeof(InvalidOperationException))]
        public  void    When_calling_the_IHttpHandler_ProcessRequest_method_an_InvalidOperationException_should_be_thrown_as_this_handler_is_designed_to_be_exclusively_called_asynchronously()
        {
            var handler = new IISHttpHandler(this.mockRouter.Object);
            ((IHttpHandler) handler).ProcessRequest(null);
        }

        [TestMethod]
        public  void    When_calling_the_IHttpHandler_IsResuable_the_value_should_be_false()
        {
            var handler = new IISHttpHandler(this.mockRouter.Object);
            Assert.IsFalse(((IHttpHandler) handler).IsReusable);
        }

    }

}
