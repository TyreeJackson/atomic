using System;
using System.Collections.Generic;
using System.Linq;
using Path = System.IO.Path;
using System.Text;
#if DEBUG
using StopWatch = System.Diagnostics.Stopwatch;
#endif
using System.Threading.Tasks;

namespace AtomicNet
{

    public
    partial     class   StaticFileHandler : WebHandler
    {

#if DEBUG
        private     StopWatch               stopWatch           = new StopWatch();
#endif

        public                              StaticFileHandler() : base()    {}

        protected
        override
        async       Task                    ProcessRequest()
        {
#if DEBUG
            this.stopWatch.Start();
#endif
            if (!this.TransmitRequestedFileIfItExists())
            if (!this.TransmitDefaultDocumentInIndexIfItExists())
            if (!this.TransmitVirtualizedFileIfItExists())
            this.RespondWithNotFound();
            this.Context.Response.End();
        }

        private     void                    RespondWithNotFound()
        {
#if DEBUG
            this.stopWatch.Stop();
            this.Context.Response.AddHeader("x-content-load-time", this.stopWatch.ElapsedMilliseconds.ToString() + "ms");
#endif
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
#if DEBUG
            this.stopWatch.Stop();
            this.Context.Response.AddHeader("x-content-load-time", this.stopWatch.ElapsedMilliseconds.ToString() + "ms");
#endif
            fileAssembler.CachedFile.contents.Position  = 0;
            fileAssembler.CachedFile.contents.CopyTo(this.Context.Response.OutputStream);
        }

        private     bool                    checkForIfNoneMatch(VirtualFileAssembler fileAssembler)
        {
            string  etag    = null;
            if (this.Context.Request.Headers.TryGetValue("If-None-Match", out etag) && etag == fileAssembler.CachedFile.etag)
            {
                this.Context.Response.StatusCode    = HttpStatusCodes.Redirection_NotModified;
                this.Context.Response.AddHeader("content-length", "0");
#if DEBUG
            this.stopWatch.Stop();
            this.Context.Response.AddHeader("x-content-load-time", this.stopWatch.ElapsedMilliseconds.ToString() + "ms");
#endif
                return true;
            }
            return false;
        }

        private     bool                    checkForMissingFiles(VirtualFileAssembler fileAssembler)
        {
            if (fileAssembler.MissingFiles.Count > 0)
            {
                this.Response.AddHeader("MissingFiles", String.Join(";", fileAssembler.MissingFiles));
#if DEBUG
            this.stopWatch.Stop();
            this.Context.Response.AddHeader("x-content-load-time", this.stopWatch.ElapsedMilliseconds.ToString() + "ms");
#endif
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
#if DEBUG
            this.stopWatch.Stop();
            this.Context.Response.AddHeader("x-content-load-time", this.stopWatch.ElapsedMilliseconds.ToString() + "ms");
#endif
                this.Context.Response.TransmitFile(Path.Combine(this.Context.Request.PhysicalPath, "index.html"));
                return true;
            }
            return false;
        }

        private     bool                    TransmitRequestedFileIfItExists()
        {
            if (System.IO.File.Exists(this.Context.Request.PhysicalPath))
            {
                this.addMimeTypeFromExtension(Path.GetExtension(this.Context.Request.Path).OrIfNullOrEmpty(Extension.html).ToLower());
#if DEBUG
            this.stopWatch.Stop();
            this.Context.Response.AddHeader("x-content-load-time", this.stopWatch.ElapsedMilliseconds.ToString() + "ms");
#endif
                this.Context.Response.TransmitFile(this.Context.Request.PhysicalPath);
                return true;
            }
            return  false;
        }

        private     void                    addMimeTypeFromExtension(string fileNameExtension)
        {
            Extension   fileExtension   = Extension.TrySelect(fileNameExtension, null);
            string      mimeType        = fileExtension != null ? fileExtension.MimeType : System.Web.MimeMapping.GetMimeMapping(fileNameExtension);

            if (!String.IsNullOrEmpty(mimeType))    this.Response.AddHeader("content-type", mimeType);
        }

    }

}
