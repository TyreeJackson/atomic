using System.Collections.Generic;

namespace AtomicNet.REST
{   partial class   ContentPackage<TContentPackage>
{

    public
    partial class   Resource : Atom
    {

        public  Action                      sourceAction;
        public  Entity                      data;
        public  IDictionary<string, Entity> metaData;

    }

}}
