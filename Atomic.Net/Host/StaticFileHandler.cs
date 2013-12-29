using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AtomicNet
{

    public
    partial     class   StaticFileHandler : WebHandler
    {

        public                  StaticFileHandler() : base()    {}

        protected
        override    Promise     ProcessRequest()
        {
            return  Atomic.Promise
            ((resolve, reject)=>
            {
                if (System.IO.File.Exists(this.Context.Request.PhysicalPath))   this.Context.Response.TransmitFile(this.Context.Request.PhysicalPath);
                else                                                            this.Context.Response.TransmitFile(System.IO.Path.Combine(this.Context.Request.PhysicalPath, "index.html"));
                resolve();
            });
        }

    }

}
