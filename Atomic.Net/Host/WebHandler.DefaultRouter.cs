using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AtomicNet
{

    public
    abstract
    partial     class   WebHandler : Atom<WebHandler>
    {

        public      class   DefaultRouter : Router
        {

            public      DefaultRouter(Args args) : base(args) {}

            public
            override    Promise<WebHandler>         Map(HostContext context)
            {
                return Atomic.Promise<WebHandler>
                ((resolve,reject)=>
                {
                    string[]    segments        = context.Request.Url.Segments;
                    int         indexOfKeyPath  = -1;

                            if (this.CheckIfUrlIsServicesUrl(segments))                                 resolve(WebHandler.Create<WebServiceHandler.ServiceList>());
                    else    if (this.CheckIfUrlIsEntitiesUrl(segments))                                 resolve(WebHandler.Create<WebServiceHandler.EntityList>());
                    else    if ((indexOfKeyPath = this.GetIndexOfServicesPathSegment(segments)) > -1)   this.LocateWebService(segments, indexOfKeyPath).WhenDone(resolve, reject);
                    else    if (this.CheckIfUrlIsStaticFile(context))                                   this.ServeStaticFile(context).WhenDone(resolve, reject);
                    else                                                                                resolve(WebHandler.Create<WebHandler.Default>());
                });
            }

            private     Promise<WebHandler>         ServeStaticFile(HostContext context)
            {
                return  Atomic.Promise<WebHandler>
                ((resolve, reject)=>
                {
                    resolve(WebHandler.Create<StaticFileHandler>().SetContext(context));
                });
            }

            private     bool                        CheckIfUrlIsStaticFile(HostContext context)
            {
                return  (
                            System.IO.File.Exists(context.Request.PhysicalPath)
                            &&
                            context.Request.RawUrl.ToLower()
                            .EndsWithOneOf
                            (
                                ".html", 
                                ".htm", 
                                ".gif", 
                                ".jpg", 
                                ".jpeg", 
                                ".png", 
                                ".txt", 
                                ".js", 
                                ".json", 
                                ".css"
                            )
                        )
                        ||
                        (
                            System.IO.Directory.Exists(context.Request.PhysicalPath)
                            &&
                            System.IO.File.Exists(System.IO.Path.Combine(context.Request.PhysicalPath, "index.html"))
                        );
            }

            private     Promise<WebServiceHandler>  LocateWebService(string[] segments, int indexOfKeyPath)
            {
                return Atomic.Promise<WebServiceHandler>
                ((resolve, reject)=>
                {
                    string  segment = segments[indexOfKeyPath+1].TrimEnd("/");
                    #warning NotImplemented
                    reject(new NotImplementedException());
                });
            }

            private     int                         GetIndexOfServicesPathSegment(string[] segments)
            {
                return segments.IndexOfLast(segment=>segment.ToLower().Replace('\\', '/').TrimEnd("/") == "services");
            }

            private     bool                        CheckIfUrlIsEntitiesUrl(string[] segments)
            {
                return segments[segments.Length-1].ToLower().Replace('\\', '/').TrimEnd("/") == "entities";
            }

            private     bool                        CheckIfUrlIsServicesUrl(string[] segments)
            {
                return segments[segments.Length-1].ToLower().Replace('\\', '/').TrimEnd("/") == "services";
            }
        }

    }

}
