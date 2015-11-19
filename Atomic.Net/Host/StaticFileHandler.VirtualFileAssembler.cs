using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Path = System.IO.Path;
using File = System.IO.File;
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

            public  class   DependencyCache
            {
                public  DateTime        dependencyListLastModified  = DateTime.MinValue;
                public  string[]        dependencyList;
            }
            public  class   FileCache
            {
                public  string          etag;
                public  MemoryStream    contents;
                public  DateTime        lastModified    = DateTime.MinValue;
            }

            private
            static  string          utf8ByteOrderMark       = Encoding.UTF8.GetString(Encoding.UTF8.GetPreamble());
            private
            static  string          utf32ByteOrderMark      = Encoding.UTF32.GetString(Encoding.UTF32.GetPreamble());
            public  HostContext     Context;
            public  string          RequestDirectoryPath;
            public  Extension       FileExtension;
            public  FileCache       CachedFile;
            public  List<string>    MissingFiles            { get { return this.missingFiles; } }

            public      bool        RequestedFileIsVirtual()
            {
                return this.FileExtension != null && File.Exists(this.Context.Server.MapPath(VirtualPath.Combine('/', this.RequestDirectoryPath, ".dep")));
            }

            public      void        GetFileContents()
            {
                lock(this.assemblerLock)
                try
                {
                    this.fullFileName   = new StringBuilder();
                    this.content        = new MemoryStream();
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
                            contents        = this.content, 
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
                    >                   fileCache               = new Dictionary<string,FileCache>();
            private
            static  Dictionary
                    <
                        string,
                        DependencyCache
                    >                   dependencyCache         = new Dictionary<string,DependencyCache>(); 
            private List<string>        includedFiles           = new List<string>();
            private List<string>        missingFiles            = new List<string>();
            private MemoryStream        content;
            private object              assemblerLock           = new object();
            private DateTime            lastModified            = DateTime.MinValue;
            private List<Action>        loadContent             = new List<Action>();
            private StringBuilder       fullFileName;

            private     void            AddFileContents(string byParent, string fromPath) { this.AddFileContents(byParent, fromPath, new List<string>()); }

            private     void            AddFileContents(string byParent, string fromPath, List<string> dependents)
            {
                bool    currentFileHasNotBeenIncluded   = true;

                this.includedFiles.Add(fromPath);

                this.AddPreContentsIfTheyExist(byParent, fromPath);

                foreach(string dependency in this.GetDependencyEntries(fromPath))
                {
                    if (dependency != ".")  this.AddDependencyContent(fromDependency: dependency, relativeTo: fromPath, dependents: dependents);
                    else
                    {
                        this.AddMainFileContents(byParent, fromPath, providedThat: currentFileHasNotBeenIncluded);
                        currentFileHasNotBeenIncluded   = true;
                    }
                }

                this.AddMainFileContents(byParent, fromPath, providedThat: currentFileHasNotBeenIncluded);

                this.AddPostContentsIfTheyExist(byParent, fromPath);
            }

            private     void            AddPreContentsIfTheyExist(string byParent, string fromPath)
            {
                this.AddStaticFileContentIfItExists(byParent, fromPath: VirtualPath.Combine('/', fromPath, this.FileExtension + ".pre"));
            }

            private     void            AddDependencyContent(string fromDependency, string relativeTo, List<string> dependents)
            {
                string  rawDependencyPath   = VirtualPath.Combine('/', "~/", fromDependency.Replace(".", "/"));
                string  dependencyFilePath  = VirtualPath.Combine('/', System.Web.VirtualPathUtility.GetDirectory(rawDependencyPath), System.Web.VirtualPathUtility.GetFileName(rawDependencyPath));
                if (dependents.Contains(dependencyFilePath))    return;
                if (!this.AddStaticFileContentIfItExists(VirtualPath.Combine('/', relativeTo, this.FileExtension), fromPath: dependencyFilePath + FileExtension));
                var newDependents   = new List<string>(dependents);
                newDependents.Add(dependencyFilePath);
                if (!this.AddVirtualizedFileContentIfItExists(VirtualPath.Combine('/', relativeTo, this.FileExtension), fromPath: dependencyFilePath, dependents: newDependents))
                this.LogMissing(file: dependencyFilePath + FileExtension, requiredBy: VirtualPath.Combine('/', relativeTo, FileExtension));
            }

            private     void            LogMissing(string file, string requiredBy)
            {
                missingFiles.Add(file + " by " + requiredBy);
            }

            private     void            AddMainFileContents(string byParent, string fromPath, bool providedThat)
            {
                providedThat.then(proceedWith: ()=>this.AddStaticFileContentIfItExists(byParent, VirtualPath.Combine('/', fromPath, this.FileExtension)));
            }

            private     void            AddPostContentsIfTheyExist(string byParent, string fromPath)
            {
                this.AddStaticFileContentIfItExists(byParent, VirtualPath.Combine('/', fromPath, this.FileExtension + ".post"));
            }

            private     void            AddFileContentsIfNotAlreadyIncluded(string byParent, string currentDependencyDirectoryPath)
            {
                if (this.includedFiles.Contains(currentDependencyDirectoryPath)) return;
                this.AddFileContents(byParent, currentDependencyDirectoryPath);
            }

            private     bool            AddVirtualizedFileContentIfItExists(string byParent, string fromPath, List<string> dependents)
            {
                if (File.Exists(this.Context.Server.MapPath(VirtualPath.Combine('/', fromPath, ".dep"))))
                {
                    this.AddFileContents(byParent, fromPath, dependents);
                    return true;
                }
                return false;
            }

            private     string[]        GetDependencyEntries(string currentDependencyDirectoryPath)
            {
                string          currentDependencyFilePath   = VirtualPath.Combine('/', currentDependencyDirectoryPath, ".dep");
                DependencyCache dependencyCacheEntry        = null;
                if (!dependencyCache.TryGetValue(currentDependencyFilePath, out dependencyCacheEntry) || dependencyCacheEntry.dependencyListLastModified < File.GetLastWriteTime(currentDependencyFilePath))
                {
                    dependencyCacheEntry    =
                    new DependencyCache()
                    {
                        dependencyListLastModified  = File.GetLastWriteTime(currentDependencyFilePath),
                        dependencyList              = File.ReadAllLines(this.Context.Server.MapPath(currentDependencyFilePath))
                    };
                    VirtualFileAssembler.dependencyCache[currentDependencyFilePath] = dependencyCacheEntry;
                }
                return dependencyCacheEntry.dependencyList;
            }

            private     bool            AddStaticFileContentIfItExists(string byParent, string fromPath)
            {
                string  physicalPath    = this.Context.Server.MapPath(fromPath);

                if (!File.Exists(physicalPath))   return false;

                this.AddStaticFileContent(byParent, fromPath, physicalPath);
                return true;
            }

            private     void            AddStaticFileContent(string byParent, string fromPath, string physicalPath)
            {
                if (this.includedFiles.Contains(fromPath))   return;
                this.includedFiles.Add(fromPath);
                this.lastModified   = this.lastModified.Or(File.GetLastWriteTime(physicalPath), IfIts.Greater);
                var depFileName     = Path.Combine(Path.GetDirectoryName(physicalPath), Path.GetFileNameWithoutExtension(physicalPath), ".dep");
                if (File.Exists(depFileName)) this.lastModified   = this.lastModified.Or(File.GetLastWriteTime(depFileName), IfIts.Greater);
                this.fullFileName.Append((this.fullFileName.Length == 0 ? String.Empty : "|") + physicalPath);
                this.loadContent.Add
                (()=>
                {
                    this.content.WriteAll(Encoding.UTF8.GetBytes(this.FileExtension.Comment.FormattedWith(fromPath, byParent)+"\n"));
                    this.content.WriteAll(this.readAllText(physicalPath));
                });
            }

            private     string          normalizeEndings(string value)
            {
                return value.Replace("\r\n", "\n");
            }

            private     string          stripByteOrderMarks(string value)
            {
                if (value.StartsWith(utf32ByteOrderMark))   value   = value.Remove(0, utf32ByteOrderMark.Length-1);
                if (value.StartsWith(utf8ByteOrderMark))    value   = value.Remove(0, utf8ByteOrderMark.Length-1);
                return value;
            }

            private     byte[]          readAllText(string physicalPath)
            {
                return Encoding.UTF8.GetBytes(this.normalizeEndings(this.stripByteOrderMarks(File.ReadAllText(physicalPath, Encoding.UTF8)))+"\n");
            }

            // ****************************************************************
                #endregion Private
            // ****************************************************************

        }

    }

}
