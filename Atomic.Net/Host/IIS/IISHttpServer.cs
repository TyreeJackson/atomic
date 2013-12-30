using System;
using System.Collections.Generic;
using System.Text;
using System.Web;
using AtomicNet;

namespace AtomicNet.IIS
{

    public  class IISHttpServerUtility : HostServerUtility
    {

        protected
        new             IISHttpContext      context                                                         { get { return (IISHttpContext) base.context; } }

        private         HttpServerUtility   server                                                          { get { return this.context.context.Server; } }

        public                              IISHttpServerUtility(IISHttpContext context) : base(context)    {}


        public
        override        string              MapPath(string path)                                            { return this.server.MapPath(path); }

    }

}
