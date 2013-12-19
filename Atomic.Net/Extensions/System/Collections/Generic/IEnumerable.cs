﻿using System.Collections.Generic;
using System.Linq;
using AtomicNet;

namespace AtomicNet
{

    public
    static
    class   IEnumerable
    {

        public
        static  int IndexOfLast<t>(this IEnumerable<t> thisEnumerable)
        {
            Throw<System.ArgumentNullException>.If(thisEnumerable == null, "IndexOfLast cannot be executed against a null enumerable list.");

            return thisEnumerable.Count() - 1;
        }

        public
        static  int IndexOfLast<t>(this IEnumerable<t> thisEnumerable, System.Func<t, bool> predicate)
        {
            Throw<System.ArgumentNullException>
            .If(thisEnumerable == null, "IndexOfLast cannot be executed against a null enumerable list.")
            .OrIf(predicate == null, "Predicate argument cannot be null");

            int counter     = 0;
            int lastIndex   = -1;

            foreach(t item in thisEnumerable)
            {
                if (predicate(item))    lastIndex   = counter;
                counter++;
            }

            return lastIndex;
        }

    }

}
