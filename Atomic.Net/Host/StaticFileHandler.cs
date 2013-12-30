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
            string  fileExtension               = Path.GetExtension(this.Context.Request.PhysicalPath).ToLower();
            string  filePathWithoutExtension    = Path.Combine(Path.GetDirectoryName(this.Context.Request.PhysicalPath), Path.GetFileNameWithoutExtension(this.Context.Request.PhysicalPath));

            if (fileExtension.IsOneOf(".js", ".css", ".html") && System.IO.File.Exists(Path.Combine(filePathWithoutExtension, ".dep")))
            {
                this.Context.Response.Write(this.GetFileContents(System.Web.VirtualPathUtility.GetDirectory(this.Context.Request.Path), Path.Combine(filePathWithoutExtension), fileExtension));
                return true;
            }
            return false;
        }

        private     string      GetFileContents(string requestPath, string currentDependencyDirectoryPath, string fileExtension)
        {
            StringBuilder   content                     = new StringBuilder();
            this.GetFileContents(content, requestPath, currentDependencyDirectoryPath, fileExtension);
            return content.ToString();
        }

        private     void        GetFileContents(StringBuilder content, string requestPath, string currentDependencyDirectoryPath, string fileExtension)
        {
            string      currentDependencyFilePath   = Path.Combine(currentDependencyDirectoryPath, ".dep");
            string[]    dependencies                = System.IO.File.ReadAllLines(currentDependencyFilePath);
            bool        currentFileHasBeenIncluded  = false;

            foreach(string dependency in dependencies)
            {
                if (dependency == ".")
                {
                    this.AddStaticFileContent(content, Path.Combine(currentDependencyDirectoryPath, fileExtension));
                    currentFileHasBeenIncluded  = true;
                }
                else
                {
                    string  rawDependencyPath   = Path.Combine(requestPath, dependency.Replace(".", "/").Replace("//", "../"));
                    string  dependencyPath      = Path.Combine(System.Web.VirtualPathUtility.GetDirectory(rawDependencyPath), System.Web.VirtualPathUtility.GetFileName(rawDependencyPath));
                    string  dependencyFilePath  = this.Context.Server.MapPath(dependencyPath);

                    if (!this.AddStaticFileContent(content, Path.Combine(dependencyFilePath, fileExtension)))
                    this.AddVirtualizedFileContentIfItExists(content, dependencyPath, dependencyFilePath, fileExtension);
                }
            }
            if (!currentFileHasBeenIncluded)    this.AddStaticFileContent(content, Path.Combine(currentDependencyDirectoryPath, fileExtension));
        }

        private     void        AddVirtualizedFileContentIfItExists(StringBuilder content, string dependencyPath, string dependencyFilePath, string fileExtension)
        {
            if (System.IO.File.Exists(Path.Combine(dependencyFilePath, ".dep")))
            {
                this.GetFileContents(content, dependencyPath, dependencyFilePath, fileExtension);
            }
        }

        private     bool        AddStaticFileContent(StringBuilder content, string filePath)
        {
            if (System.IO.File.Exists(filePath))
            {
                content.Append(System.IO.File.ReadAllText(filePath));
                return true;
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
