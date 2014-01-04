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
            string          fileExtension               = Path.GetExtension(this.Context.Request.PhysicalPath).ToLower();
            string          filePathWithoutExtension    = Path.Combine(Path.GetDirectoryName(this.Context.Request.PhysicalPath), Path.GetFileNameWithoutExtension(this.Context.Request.PhysicalPath));
            List<string>    missingFiles                = new List<string>();
            List<string>    includedFiles               = new List<string>();

            if (fileExtension.IsOneOf(".js", ".css", ".html") && System.IO.File.Exists(Path.Combine(filePathWithoutExtension, ".dep")))
            {
                this.Context.Response.Write(this.GetFileContents(System.Web.VirtualPathUtility.GetDirectory(this.Context.Request.Path), Path.Combine(filePathWithoutExtension), fileExtension, includedFiles, missingFiles));
                if (missingFiles.Count > 0) this.Response.AddHeader("MissingFiles", String.Join(";", missingFiles));
                return missingFiles.Count == 0;
            }
            return false;
        }

        private     string      GetFileContents(string requestPath, string currentDependencyDirectoryPath, string fileExtension, List<string> includedFiles, List<string> missingFiles)
        {
            StringBuilder   content                     = new StringBuilder();
            this.GetFileContents(content, requestPath, currentDependencyDirectoryPath, fileExtension, includedFiles, missingFiles);
            return missingFiles.Count == 0 ? content.ToString() : String.Empty;
        }

        private     bool        GetFileContents(StringBuilder content, string requestPath, string currentDependencyDirectoryPath, string fileExtension, List<string> includedFiles, List<string> missingFiles)
        {
            string      currentDependencyFilePath   = Path.Combine(currentDependencyDirectoryPath, ".dep");
            if (includedFiles.Contains(currentDependencyDirectoryPath)) return true;
            includedFiles.Add(currentDependencyDirectoryPath);
            string[]    dependencies                = System.IO.File.ReadAllLines(currentDependencyFilePath);
            bool        currentFileHasBeenIncluded  = false;
            bool        fileNotFound                = false;

            if (System.IO.File.Exists(Path.Combine(currentDependencyDirectoryPath, fileExtension + ".pre")))    this.AddStaticFileContent(content, Path.Combine(currentDependencyDirectoryPath, fileExtension + ".pre"), includedFiles);
            foreach(string dependency in dependencies)
            {
                if (dependency == ".")
                {
                    this.AddStaticFileContent(content, Path.Combine(currentDependencyDirectoryPath, fileExtension), includedFiles);
                    currentFileHasBeenIncluded  = true;
                }
                else
                {
                    string  rawDependencyPath   = Path.Combine("~/", dependency.Replace(".", "/"));
                    string  dependencyPath      = Path.Combine(System.Web.VirtualPathUtility.GetDirectory(rawDependencyPath), System.Web.VirtualPathUtility.GetFileName(rawDependencyPath));
                    string  dependencyFilePath  = this.Context.Server.MapPath(dependencyPath);

                    if (!this.AddStaticFileContent(content, dependencyFilePath + fileExtension, includedFiles))
                    if (!this.AddVirtualizedFileContentIfItExists(content, dependencyPath, dependencyFilePath, fileExtension, includedFiles, missingFiles))
                    missingFiles.Add(dependencyFilePath + fileExtension + " by " + Path.Combine(currentDependencyDirectoryPath, fileExtension));
                }

            }
            if (!currentFileHasBeenIncluded)    this.AddStaticFileContent(content, Path.Combine(currentDependencyDirectoryPath, fileExtension), includedFiles);
            if (System.IO.File.Exists(Path.Combine(currentDependencyDirectoryPath, fileExtension + ".post")))   this.AddStaticFileContent(content, Path.Combine(currentDependencyDirectoryPath, fileExtension + ".post"), includedFiles);
            return missingFiles.Count == 0;
        }

        private     bool        AddVirtualizedFileContentIfItExists(StringBuilder content, string dependencyPath, string dependencyFilePath, string fileExtension, List<string> includedFiles, List<string> missingFiles)
        {
            if (System.IO.File.Exists(Path.Combine(dependencyFilePath, ".dep")))
            {
                this.GetFileContents(content, System.Web.VirtualPathUtility.GetDirectory(dependencyPath), dependencyFilePath, fileExtension, includedFiles, missingFiles);
                return true;
            }
            return false;
        }

        private     bool        AddStaticFileContent(StringBuilder content, string filePath, List<string> includedFiles)
        {
            if (includedFiles.Contains(filePath))   return true;
            includedFiles.Add(filePath);
            if (System.IO.File.Exists(filePath))
            {
                content.AppendLine(System.IO.File.ReadAllText(filePath));
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
