using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

public class Atomic<tAtomic> where tAtomic : Atomic<tAtomic>
{
    
}

public class Atomic : Atomic<Atomic>
{
}