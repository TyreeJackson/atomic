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
                    else                                                                                resolve(WebHandler.Create<WebHandler.Default>());
                });
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
