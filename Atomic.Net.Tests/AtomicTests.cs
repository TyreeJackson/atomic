using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace AtomicNetTests
{

    [TestClass]
    public class AtomicTests
    {

        [TestMethod]
        public void WhenCallingAtomicPromiseMethodItShouldNeverReturnNull()
        {
            Assert.IsNotNull(Atomic.Promise((resolve,reject)=>{}), "Atomic.Promise returned null.");
        }

        [TestMethod]
        public void WhenCallingAtomicPromiseMethodItShouldReturnAPromise()
        {
            Assert.IsInstanceOfType(Atomic.Promise((resolve,reject)=>{}), typeof(AtomicNet.Promise), "Atomic.Promise did not return a promise.");
        }

        [TestMethod]
        public void WhenCallingAtomicPromiseOfIntMethodItShouldNeverReturnNull()
        {
            Assert.IsNotNull(Atomic.Promise<int>((resolve,reject)=>{}), "Atomic.Promise returned null.");
        }

        [TestMethod]
        public void WhenCallingAtomicPromiseOfIntMethodItShouldReturnAPromise()
        {
            Assert.IsInstanceOfType(Atomic.Promise<int>((resolve,reject)=>{}), typeof(AtomicNet.Promise<int>), "Atomic.Promise did not return a promise.");
        }

    }

}
