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

        public                              StaticFileHandler() : base()    {}

        protected
        override    Promise                 ProcessRequest()
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

        private     void                    RespondWithNotFound()
        {
            this.Context.Response.StatusCode        = HttpStatusCodes.ClientError_NotFound;
            this.Context.Response.StatusDescription = "Not found";
            this.Context.Response.Write("File not found.");
        }

        private     bool                    TransmitVirtualizedFileIfItExists()
        {
            Extension               fileExtension   = Extension.TrySelect(Path.GetExtension(this.Context.Request.Path).OrIfNullOrEmpty(Extension.html).ToLower(), null);

            VirtualFileAssembler    fileAssembler   = this.createFileAssembler(fileExtension);

            if (fileExtension == null || !fileAssembler.RequestedFileIsVirtual())   return false;

            fileAssembler.GetFileContents();

            if (this.checkForMissingFiles(fileAssembler))                           return false;

            this.Response.AddHeader("content-type", fileExtension.MimeType);

            if(this.checkForIfNoneMatch(fileAssembler))                             return true;

            this.respondWithContent(fileAssembler);

            return true;
        }

        private     void                    respondWithContent(VirtualFileAssembler fileAssembler)
        {
            this.Context.Response.AddHeader("ETag", fileAssembler.CachedFile.etag);
            this.Context.Response.AddHeader("content-length", fileAssembler.CachedFile.contents.Length.ToString());
            this.Context.Response.Write(fileAssembler.CachedFile.contents);
        }

        private     bool                    checkForIfNoneMatch(VirtualFileAssembler fileAssembler)
        {
            string  etag    = null;
            if (this.Context.Request.Headers.TryGetValue("If-None-Match", out etag) && etag == fileAssembler.CachedFile.etag)
            {
                this.Context.Response.StatusCode    = HttpStatusCodes.Redirection_NotModified;
                this.Context.Response.AddHeader("content-length", "0");
                return true;
            }
            return false;
        }

        private     bool                    checkForMissingFiles(VirtualFileAssembler fileAssembler)
        {
            if (fileAssembler.MissingFiles.Count > 0)
            {
                this.Response.AddHeader("MissingFiles", String.Join(";", fileAssembler.MissingFiles));
                return true;
            }
            return false;
        }

        private     VirtualFileAssembler    createFileAssembler(string fileExtension)
        {
            return
            new VirtualFileAssembler()
            {
                Context                 = this.Context, 
                FileExtension           = Extension.TrySelect(fileExtension, null), 
                RequestDirectoryPath    = VirtualPath.Combine('/', VirtualPath.GetDirectoryName('/', this.Context.Request.Path), Path.GetFileNameWithoutExtension(this.Context.Request.Path))
            };
        }

        private     bool                    TransmitDefaultDocumentInIndexIfItExists()
        {
            if (System.IO.File.Exists(Path.Combine(this.Context.Request.PhysicalPath, "index.html")))
            {
                this.Context.Response.TransmitFile(Path.Combine(this.Context.Request.PhysicalPath, "index.html"));
                return true;
            }
            return false;
        }

        private     bool                    TransmitRequestedFileIfItExists()
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
