using System;
using System.Web;
using AtomicNet;

namespace AtomicNet.IIS
{

    public  class IISHttpHandler : HostHandler, IHttpHandler
    {

        bool    IHttpHandler.IsReusable { get { return false; } }

        void IHttpHandler.ProcessRequest(HttpContext context)   { base.ProcessRequest(new IISHttpContext(context, this)); }

    }

}
