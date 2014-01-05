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

        private
        partial     class VirtualFileAssembler
        {

            public  class   FileCache
            {
                public  string      etag;
                public  string      contents;
                public  DateTime    lastModified    = DateTime.MinValue;
            }

            public  HostContext     Context;
            public  string          RequestDirectoryPath;
            public  Extension       FileExtension;
            public  FileCache       CachedFile;
            public  List<string>    MissingFiles            { get { return this.missingFiles; } }

            public      bool        RequestedFileIsVirtual()
            {
                return this.FileExtension != null && System.IO.File.Exists(this.Context.Server.MapPath(VirtualPath.Combine('/', this.RequestDirectoryPath, ".dep")));
            }

            public      void        GetFileContents()
            {
                lock(this.assemblerLock)
                try
                {
                    this.fullFileName   = new StringBuilder();
                    this.content        = new StringBuilder();
                    this.AddFileContents(byParent: this.RequestDirectoryPath+this.FileExtension, fromPath: this.RequestDirectoryPath);
                    this.fullFileName.Append("|"+this.lastModified.ConvertToEpoch().ToString());
                    if
                    (
                        !VirtualFileAssembler.fileCache.TryGetValue(this.RequestDirectoryPath+this.FileExtension, out this.CachedFile)
                        ||
                        this.lastModified > this.CachedFile.lastModified
                    )
                    {
                        this.loadContent.ForEach(a=>a());
                        VirtualFileAssembler.fileCache[this.RequestDirectoryPath+this.FileExtension]    =
                        this.CachedFile = 
                        new FileCache()
                        {
                            etag            = this.fullFileName.ToString(), 
                            contents        = this.content.ToString(), 
                            lastModified    = this.lastModified
                        };
                    }
                }
                finally
                {
                    this.content    = null;
                }
            }

            // ****************************************************************
                #region Private
            // ****************************************************************

            private
            static  Dictionary
                    <
                        string,
                        FileCache
                    >               fileCache               = new Dictionary<string,FileCache>();
            private List<string>    includedFiles           = new List<string>();
            private List<string>    missingFiles            = new List<string>();
            private StringBuilder   content;
            private object          assemblerLock           = new object();
            private DateTime        lastModified            = DateTime.MinValue;
            private List<Action>    loadContent             = new List<Action>();
            private StringBuilder   fullFileName;

            private     void        AddFileContents(string byParent, string fromPath)
            {
                bool    currentFileHasNotBeenIncluded   = true;

                this.includedFiles.Add(fromPath);

                this.AddPreContentsIfTheyExist(byParent, fromPath);

                foreach(string dependency in this.GetDependencyEntries(fromPath))
                {
                    if (dependency != ".")  this.AddDependencyContent(fromDependency: dependency, relativeTo: fromPath);
                    else
                    {
                        this.AddMainFileContents(byParent, fromPath, providedThat: currentFileHasNotBeenIncluded);
                        currentFileHasNotBeenIncluded   = true;
                    }
                }

                this.AddMainFileContents(byParent, fromPath, providedThat: currentFileHasNotBeenIncluded);

                this.AddPostContentsIfTheyExist(byParent, fromPath);
            }

            private     void        AddPreContentsIfTheyExist(string byParent, string fromPath)
            {
                this.AddStaticFileContentIfItExists(byParent, fromPath: VirtualPath.Combine('/', fromPath, this.FileExtension + ".pre"));
            }

            private     void        AddDependencyContent(string fromDependency, string relativeTo)
            {
                string  rawDependencyPath   = VirtualPath.Combine('/', "~/", fromDependency.Replace(".", "/"));
                string  dependencyFilePath  = VirtualPath.Combine('/', System.Web.VirtualPathUtility.GetDirectory(rawDependencyPath), System.Web.VirtualPathUtility.GetFileName(rawDependencyPath));

                if (!this.AddStaticFileContentIfItExists(VirtualPath.Combine('/', relativeTo, this.FileExtension), fromPath: dependencyFilePath + FileExtension))
                if (!this.AddVirtualizedFileContentIfItExists(VirtualPath.Combine('/', relativeTo, this.FileExtension), fromPath: dependencyFilePath))
                this.LogMissing(file: dependencyFilePath + FileExtension, requiredBy: VirtualPath.Combine('/', relativeTo, FileExtension));
            }

            private     void        LogMissing(string file, string requiredBy)
            {
                missingFiles.Add(file + " by " + requiredBy);
            }

            private     void        AddMainFileContents(string byParent, string fromPath, bool providedThat)
            {
                providedThat.then(proceedWith: ()=>this.AddStaticFileContentIfItExists(byParent, VirtualPath.Combine('/', fromPath, this.FileExtension)));
            }

            private     void        AddPostContentsIfTheyExist(string byParent, string fromPath)
            {
                this.AddStaticFileContentIfItExists(byParent, VirtualPath.Combine('/', fromPath, this.FileExtension + ".post"));
            }

            private     void        AddFileContentsIfNotAlreadyIncluded(string byParent, string currentDependencyDirectoryPath)
            {
                if (this.includedFiles.Contains(currentDependencyDirectoryPath)) return;
                this.AddFileContents(byParent, currentDependencyDirectoryPath);
            }

            private     bool        AddVirtualizedFileContentIfItExists(string byParent, string fromPath)
            {
                if (System.IO.File.Exists(this.Context.Server.MapPath(VirtualPath.Combine('/', fromPath, ".dep"))))
                {
                    this.AddFileContents(byParent, fromPath);
                    return true;
                }
                return false;
            }

            private     string[]    GetDependencyEntries(string currentDependencyDirectoryPath)
            {
                string      currentDependencyFilePath   = VirtualPath.Combine('/', currentDependencyDirectoryPath, ".dep");
                return System.IO.File.ReadAllLines(this.Context.Server.MapPath(currentDependencyFilePath));
            }

            private     bool        AddStaticFileContentIfItExists(string byParent, string fromPath)
            {
                string  physicalPath    = this.Context.Server.MapPath(fromPath);

                if (!System.IO.File.Exists(physicalPath))   return false;

                this.AddStaticFileContent(byParent, fromPath, physicalPath);
                return true;
            }

            private     void        AddStaticFileContent(string byParent, string fromPath, string physicalPath)
            {
                if (this.includedFiles.Contains(fromPath))   return;
                this.includedFiles.Add(fromPath);
                this.lastModified   = this.lastModified.Or(System.IO.File.GetLastWriteTime(physicalPath), IfIts.Greater);
                this.fullFileName.Append((this.fullFileName.Length == 0 ? String.Empty : "|") + physicalPath);
                this.loadContent.Add
                (()=>
                {
                    this.content.AppendLine(this.FileExtension.Comment.FormattedWith(fromPath, byParent));
                    this.content.AppendLine(System.IO.File.ReadAllText(physicalPath)+"\n");
                });
            }

            // ****************************************************************
                #endregion Private
            // ****************************************************************

        }

    }

}
