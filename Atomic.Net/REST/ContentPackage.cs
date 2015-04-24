using System;

namespace AtomicNet.REST
{

    public
    abstract
    partial     class   ContentPackage
    {
        public
        abstract    string  contentType { get; }
    }

    public
    abstract
    partial     class   ContentPackage<TContentPackage> : ContentPackage where TContentPackage : ContentPackage<TContentPackage>
    {
        public  Resource    resource;
    }

}
