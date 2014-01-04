using System;
using System.Collections.Generic;
using System.Linq;
using Path = System.IO.Path;
using System.Text;
using System.Threading.Tasks;

namespace AtomicNet
{

    public
    partial     class   StaticFileHandler : WebHandler
    {

        public  class   Extension : StringEnum<Extension>
        {
            private     string      comment;
            private     string      mimeType;

            public
            static
            readonly    Extension   html        = new Extension(".html",    "text/html",                "<!--\n    First included from {0} by {1}\n-->");

            public
            static
            readonly    Extension   js          = new Extension(".js",      "application/javascript",   "/*\n    First included from {0} by {1}\n*/");

            public
            static
            readonly    Extension   css         = new Extension(".css",     "text/css",                 "#\n#   First included from {0} by {1}\n#");
            protected                               Extension(string extension, string mimeType, string comment) : base(extension)
            {
                this.mimeType   = mimeType;
                this.comment    = comment;
            }

            public      string      Comment     { get { return this.comment; } }
            public      string      MimeType    { get { return this.mimeType; } }
        }

    }

}
