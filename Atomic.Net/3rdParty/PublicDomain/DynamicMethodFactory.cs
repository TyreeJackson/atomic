using System;
using System.Reflection;
using System.Reflection.Emit;

namespace AtomicNet.Dependencies.PublicDomain
{

    ///
    /// Factory class to invoke a method on a type using Dynamic Methods in C# 2.0
    /// Borrowed and heavily refactored from http://blog.robgarrett.com/2005/10/12/reflection-and-lcg/
    ///
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverage]
    public class DynamicMethodFactory
    {

        ///
        /// Factory returns a delegate instance for the invoked method.
        ///
        /// Target object (null if invoking the constructor).
        /// Arguments.
        /// Return type of some sort.
        public delegate object DynamicMethodDelegate(object target, object[] args);

    }

}