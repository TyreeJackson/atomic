using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AtomicNet
{

    public
    abstract
    partial     class   AtomicService : Component<AtomicService, AtomicService.ServiceArgs, AtomicService.Config>
    {

        public
        class       ServiceArgs{}

        public
        abstract    bool    IsReusable  { get; }

        protected           AtomicService(ServiceArgs args) : base(args) {}

    }

    public
    abstract
    partial 
    class       AtomicService<tAtomicService, tAtomicServiceArgs, tAtomicServiceConfig> : AtomicService
    where       tAtomicService                                                          : AtomicService<tAtomicService, tAtomicServiceArgs, tAtomicServiceConfig>
    where       tAtomicServiceArgs                                                      : AtomicService<tAtomicService, tAtomicServiceArgs, tAtomicServiceConfig>.ServiceArgs
    where       tAtomicServiceConfig                                                    : AtomicService<tAtomicService, tAtomicServiceArgs, tAtomicServiceConfig>.Config
    {

        private
        static
        readonly    string  _name           = typeof(tAtomicService).Name;

        private
        static
        readonly    string  _factoryName    = typeof(tAtomicService).FullName + "+Factory";

        public
        override    bool    IsReusable                              { get { return true; } }

        protected           AtomicService(tAtomicServiceArgs args)  : base(args) {}

    }

}
