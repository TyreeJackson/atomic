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

        public                  StaticFileHandler() : base()    {}

        protected
        override    Promise     ProcessRequest()
        {
            return  Atomic.Promise
            ((resolve, reject)=>
            {
                if (!this.TransmitRequestedFileIfItExists())
                if (!this.TransmitDefaultDocumentInIndexIfItExists())
                if (!this.TransmitVirtualizedFileIfItExists())
                this.RespondWithNotFound();
                resolve();
            });
        }

        private     void        RespondWithNotFound()
        {
            this.Context.Response.StatusCode        = HttpStatusCodes.ClientError_NotFound;
            this.Context.Response.StatusDescription = "Not found";
            this.Context.Response.Write("File not found.");
        }

        private     bool        TransmitVirtualizedFileIfItExists()
        {
            string                  fileExtension   = Path.GetExtension(this.Context.Request.Path).OrIfNullOrEmpty(Extension.html).ToLower();

            VirtualFileAssembler    fileAssembler   =
            new VirtualFileAssembler()
            {
                Context                 = this.Context, 
                FileExtension           = Extension.TrySelect(fileExtension, null), 
                RequestDirectoryPath    = VirtualPath.Combine('/', VirtualPath.GetDirectoryName('/', this.Context.Request.Path), Path.GetFileNameWithoutExtension(this.Context.Request.Path))
            };

            if (fileAssembler.RequestedFileIsVirtual())
            {
                this.Context.Response.Write(fileAssembler.GetFileContents());

                if (fileAssembler.MissingFiles.Count > 0) this.Response.AddHeader("MissingFiles", String.Join(";", fileAssembler.MissingFiles));
                this.Response.AddHeader("content-type", Extension.TrySelect(fileExtension, null).MimeType);
                return fileAssembler.MissingFiles.Count == 0;
            }
            return false;
        }

        private     bool        TransmitDefaultDocumentInIndexIfItExists()
        {
            if (System.IO.File.Exists(Path.Combine(this.Context.Request.PhysicalPath, "index.html")))
            {
                this.Context.Response.TransmitFile(Path.Combine(this.Context.Request.PhysicalPath, "index.html"));
                return true;
            }
            return false;
        }

        private     bool        TransmitRequestedFileIfItExists()
        {
            if (System.IO.File.Exists(this.Context.Request.PhysicalPath))
            {
                this.Context.Response.TransmitFile(this.Context.Request.PhysicalPath);
                return true;
            }
            return  false;
        }

    }

}
