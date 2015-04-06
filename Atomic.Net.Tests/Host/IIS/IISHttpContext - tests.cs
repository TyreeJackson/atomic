using System;
using System.IO;
using System.Text;
using System.Web;
using AtomicNet;
using AtomicNet.IIS;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace AtomicNetTests
{

    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverage]
    [TestClass]
    public class IISHttpContextTests
    {

        private StringBuilder               outputBuilder;
        private TextWriter                  writer;
        private HttpContext                 httpContext;
        private Mock<IISHttpApplication>    mockHttpApplication;
        private Mock<IISHttpRequest>        mockHttpRequest;
        private Mock<IISHttpResponse>       mockHttpResponse;
        private Mock<IISHttpServerUtility>  mockHttpServer;
        private Mock<IISHostPrincipal>      mockHostPrincipal;
        private Mock<IISHttpHandler>        mockHostHandler;

        [TestInitialize]
        public  void    Initialize()
        {
            this.outputBuilder          = new StringBuilder();
            this.writer                 = new StringWriter(this.outputBuilder);
            this.httpContext            = new HttpContext(new System.Web.Hosting.SimpleWorkerRequest("/test", "m:\test", "test.html", String.Empty, this.writer));
            this.mockHttpApplication    = new Mock<IISHttpApplication>();
            this.mockHttpRequest        = new Mock<IISHttpRequest>();
            this.mockHttpResponse       = new Mock<IISHttpResponse>();
            this.mockHttpServer         = new Mock<IISHttpServerUtility>();
            this.mockHostPrincipal      = new Mock<IISHostPrincipal>();
            this.mockHostHandler        = new Mock<IISHttpHandler>();
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentNullException))]
        public  void    When_constructing_an_IISHttpContext_the_context_argument_must_not_be_null()
        {
            var context = new IISHttpContext(null);
        }

        [TestMethod]
        public  void    When_getting_the_ApplicationInstance_from_the_IISHttpContext_instance_our_mockHttpApplication_should_be_returned()
        {
            var context =   new IISHttpContext
                            (
                                this.httpContext,
                                hostContext=>this.mockHttpApplication.Object,
                                hostContext=>this.mockHttpRequest.Object,
                                hostContext=>this.mockHttpServer.Object,
                                hostContext=>this.mockHttpResponse.Object,
                                user=>this.mockHostPrincipal.Object,
                                ()=>this.mockHostHandler.Object
                            );
            Assert.AreEqual(this.mockHttpApplication.Object, context.ApplicationInstance);
        }

        [TestMethod]
        public  void    When_getting_the_Handler_from_the_IISHttpContext_instance_our_mockHostHandler_should_be_returned()
        {
            var context =   new IISHttpContext
                            (
                                this.httpContext,
                                hostContext=>this.mockHttpApplication.Object,
                                hostContext=>this.mockHttpRequest.Object,
                                hostContext=>this.mockHttpServer.Object,
                                hostContext=>this.mockHttpResponse.Object,
                                user=>this.mockHostPrincipal.Object,
                                ()=>this.mockHostHandler.Object
                            );
            Assert.AreEqual(this.mockHostHandler.Object, context.Handler);
        }

        [TestMethod]
        public  void    When_getting_the_Request_from_the_IISHttpContext_instance_our_mockHttpRequest_should_be_returned()
        {
            var context =   new IISHttpContext
                            (
                                this.httpContext,
                                hostContext=>this.mockHttpApplication.Object,
                                hostContext=>this.mockHttpRequest.Object,
                                hostContext=>this.mockHttpServer.Object,
                                hostContext=>this.mockHttpResponse.Object,
                                user=>this.mockHostPrincipal.Object,
                                ()=>this.mockHostHandler.Object
                            );
            Assert.AreEqual(this.mockHttpRequest.Object, context.Request);
        }

        [TestMethod]
        public  void    When_getting_the_Response_from_the_IISHttpContext_instance_our_mockHttpResponse_should_be_returned()
        {
            var context =   new IISHttpContext
                            (
                                this.httpContext,
                                hostContext=>this.mockHttpApplication.Object,
                                hostContext=>this.mockHttpRequest.Object,
                                hostContext=>this.mockHttpServer.Object,
                                hostContext=>this.mockHttpResponse.Object,
                                user=>this.mockHostPrincipal.Object,
                                ()=>this.mockHostHandler.Object
                            );
            Assert.AreEqual(this.mockHttpResponse.Object, context.Response);
        }

        [TestMethod]
        public  void    When_getting_the_Server_from_the_IISHttpContext_instance_our_mockHttpServer_should_be_returned()
        {
            var context =   new IISHttpContext
                            (
                                this.httpContext,
                                hostContext=>this.mockHttpApplication.Object,
                                hostContext=>this.mockHttpRequest.Object,
                                hostContext=>this.mockHttpServer.Object,
                                hostContext=>this.mockHttpResponse.Object,
                                user=>this.mockHostPrincipal.Object,
                                ()=>this.mockHostHandler.Object
                            );
            Assert.AreEqual(this.mockHttpServer.Object, context.Server);
        }

        [TestMethod]
        public  void    When_getting_the_User_from_the_IISHttpContext_instance_our_mockHostPrincipal_should_be_returned()
        {
            var context =   new IISHttpContext
                            (
                                this.httpContext,
                                hostContext=>this.mockHttpApplication.Object,
                                hostContext=>this.mockHttpRequest.Object,
                                hostContext=>this.mockHttpServer.Object,
                                hostContext=>this.mockHttpResponse.Object,
                                user=>this.mockHostPrincipal.Object,
                                ()=>this.mockHostHandler.Object
                            );
            Assert.AreEqual(this.mockHostPrincipal.Object, context.User);
        }

    }

}
