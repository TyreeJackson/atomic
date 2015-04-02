using AtomicNetTests;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace AtomicNetTests
{

    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverage]
    public  class   ExpectedExceptionAttribute : ExpectedExceptionBaseAttribute
    {

        private System.Type     exceptionType;
        private System.String   exceptionMessage    = null;

        public ExpectedExceptionAttribute(System.Type exceptionType) { this.exceptionType = exceptionType; }
        public ExpectedExceptionAttribute(System.Type exceptionType, string exceptionMessage) : this(exceptionType) { this.exceptionMessage = exceptionMessage; }

        protected override void Verify(System.Exception exception)
        {
            if (exception.GetType() != this.exceptionType || (this.exceptionMessage != null && exception.Message != this.exceptionMessage)) Assert.Fail("Exception match failed.");
        }

    }

}
