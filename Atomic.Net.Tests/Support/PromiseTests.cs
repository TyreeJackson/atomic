using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace AtomicNetTests
{

    [TestClass]
    public class PromiseTests
    {

        [TestMethod]
        public void WhenResolvingAPromiseSynchronouslyItShouldCallTheResolver()
        {
            bool    resolverCalled  = false;
            AtomicNet.Promise.Create
            ((resolve,reject)=>
            {
                resolve();
            })
            .WhenDone
            (
                ()=>
                {
                    resolverCalled  = true;
                },
                ex=>Assert.Fail("An unexpected exception was thrown: " + ex.Message)
            );
            Assert.AreEqual(true, resolverCalled, "WhenDone resolver was not called synchronously.");
        }

        [TestMethod]
        public void WhenResolvingAPromiseSynchronouslyItShouldCallTheNextPromise()
        {
            bool    nextPromiseCalled   = false;
            AtomicNet.Promise.Create
            ((resolve,reject)=>
            {
                resolve();
            })
            .Then
            (
                ()=>AtomicNet.Promise.Create
                ((resolve, reject)=>
                {
                    nextPromiseCalled   = true;
                }),
                ex=>Assert.Fail("An unexpected exception was thrown: " + ex.Message)
            );
            Assert.AreEqual(true, nextPromiseCalled, "Next promise was not called synchronously.");
        }

        [TestMethod]
        public void WhenResolvingAPromiseSynchronouslyItShouldCallTheNextPromiseAndThenTheResolver()
        {
            bool    nextPromiseCalled   = false;
            bool    resolverCalled      = false;
            AtomicNet.Promise.Create
            ((resolve,reject)=>
            {
                resolve();
            })
            .Then
            (
                ()=>AtomicNet.Promise.Create
                ((resolve, reject)=>
                {
                    nextPromiseCalled   = true;
                    resolve();
                }),
                ex=>Assert.Fail("An unexpected exception was thrown: " + ex.Message)
            )
            .WhenDone
            (
                ()=>
                {
                    resolverCalled  = true;
                },
                ex=>Assert.Fail("An unexpected exception was thrown: " + ex.Message)
            );
            Assert.AreEqual(true,   nextPromiseCalled,  "Next promise was not called synchronously.");
            Assert.AreEqual(true,   resolverCalled,     "WhenDone resolver was not called synchronously.");
        }

        [TestMethod]
        public void WhenResolvingAPromiseSynchronouslyItShouldCallTheRejectorIfAnExceptionIsThrownSynchronously()
        {
            AtomicNet.Promise.Create
            ((resolve,reject)=>
            {
                throw new InvalidOperationException();
            })
            .WhenDone
            (
                ()=>
                {
                    Assert.Fail("The resolver was unexpectedly called.");
                },
                ex=>
                {
                    Assert.IsNotNull(ex, "The returned exception was null");
                    Assert.IsInstanceOfType(ex, typeof(AtomicNet.PromiseException), "An unexpected exception type was returned: " + ex.GetType().FullName);
                    Assert.IsNotNull(((AtomicNet.PromiseException) ex).InnerException, "The exception reported in the PromiseException was null");
                    Assert.IsInstanceOfType(((AtomicNet.PromiseException) ex).InnerException, typeof(InvalidOperationException), "An unexpected exception type was reported in the PromiseException: " + ((AtomicNet.PromiseException) ex).InnerException.GetType().FullName);
                }
            );
        }

        [TestMethod]
        public void WhenResolvingAPromiseOfIntSynchronouslyItShouldCallTheResolver()
        {
            int    resolverValueShouldBe10  = 0;
            AtomicNet.Promise<int>.Create
            ((resolve,reject)=>
            {
                resolve(10);
            })
            .WhenDone
            (
                value=>
                {
                    resolverValueShouldBe10 = value;
                },
                ex=>Assert.Fail("An unexpected exception was thrown: " + ex.Message)
            );
            Assert.AreEqual(10, resolverValueShouldBe10, "WhenDone resolver was not called with the correct value.");
        }

        [TestMethod]
        public void WhenResolvingAPromiseOfIntSynchronouslyItShouldCallTheRejectorIfAnExceptionIsThrownSynchronously()
        {
            AtomicNet.Promise<int>.Create
            ((resolve,reject)=>
            {
                throw new InvalidOperationException();
            })
            .WhenDone
            (
                value=>
                {
                    Assert.Fail("The resolver was unexpectedly called.");
                },
                ex=>
                {
                    Assert.IsNotNull(ex, "The returned exception was null");
                    Assert.IsInstanceOfType(ex, typeof(AtomicNet.PromiseException), "An unexpected exception type was returned: " + ex.GetType().FullName);
                    Assert.IsNotNull(((AtomicNet.PromiseException) ex).InnerException, "The exception reported in the PromiseException was null");
                    Assert.IsInstanceOfType(((AtomicNet.PromiseException) ex).InnerException, typeof(InvalidOperationException), "An unexpected exception type was reported in the PromiseException: " + ((AtomicNet.PromiseException) ex).InnerException.GetType().FullName);
                }
            );
        }

        [TestMethod]
        public void WhenResolvingAPromiseOfIntSynchronouslyItShouldCallTheNextPromise()
        {
            int    nextValueShouldBe10  = 0;
            AtomicNet.Promise<int>.Create
            ((resolve,reject)=>
            {
                resolve(10);
            })
            .Then
            (
                value=>AtomicNet.Promise.Create
                ((resolve, reject)=>
                {
                    nextValueShouldBe10 = value;
                }),
                ex=>Assert.Fail("An unexpected exception was thrown: " + ex.Message)
            );
            Assert.AreEqual(10, nextValueShouldBe10, "WhenDone resolver was not called with the correct value.");
        }

        [TestMethod]
        public void WhenResolvingAPromiseOfIntSynchronouslyItShouldCallTheNextPromiseAndThenTheResolver()
        {
            int     nextValueShouldBe10 = 0;
            bool    resolverCalled      = false;
            AtomicNet.Promise<int>.Create
            ((resolve,reject)=>
            {
                resolve(10);
            })
            .Then
            (
                value=>AtomicNet.Promise.Create
                ((resolve, reject)=>
                {
                    nextValueShouldBe10 = value;
                    resolve();
                }),
                ex=>Assert.Fail("An unexpected exception was thrown: " + ex.Message)
            )
            .WhenDone
            (
                ()=>
                {
                    resolverCalled  = true;
                },
                ex=>Assert.Fail("An unexpected exception was thrown: " + ex.Message)
            );
            Assert.AreEqual(10,     nextValueShouldBe10,    "WhenDone resolver was not called with the correct value.");
            Assert.AreEqual(true,   resolverCalled,         "WhenDone resolver was not called synchronously.");
        }

    }
        
}
