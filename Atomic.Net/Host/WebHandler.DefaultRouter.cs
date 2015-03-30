using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AtomicNet
{

    partial     class   WebHandler : Atom<WebHandler>
    {

        public      class   DefaultRouter : Router
        {

            public
            override
            async       Task<WebHandler>        Map(HostContext context)
            {
                string[]    segments        = context.Request.Url.Segments;
                int         indexOfKeyPath  = -1;

                        if (this.CheckIfUrlIsServicesUrl(segments))                                 return new WebServiceHandler.ServiceList();
                else    if (this.CheckIfUrlIsEntitiesUrl(segments))                                 return new WebServiceHandler.EntityList();
                else    if ((indexOfKeyPath = this.GetIndexOfServicesPathSegment(segments)) > -1)   return await this.LocateWebService(segments, indexOfKeyPath);
                else    return await this.ServeStaticFile(context);
            }

            private
            async       Task<WebHandler>        ServeStaticFile(HostContext context)
            {
                return new StaticFileHandler().SetContext(context);
            }

            private
            async       Task<WebServiceHandler> LocateWebService(string[] segments, int indexOfKeyPath)
            {
                string  segment = segments[indexOfKeyPath+1].TrimEnd("/");
                #warning NotImplemented
                throw new NotImplementedException();
            }

            private     int                     GetIndexOfServicesPathSegment(string[] segments)
            {
                return segments.IndexOfLast(segment=>segment.ToLower().Replace('\\', '/').TrimEnd("/") == "services");
            }

            private     bool                    CheckIfUrlIsEntitiesUrl(string[] segments)
            {
                return segments[segments.Length-1].ToLower().Replace('\\', '/').TrimEnd("/") == "entities";
            }

            private     bool                    CheckIfUrlIsServicesUrl(string[] segments)
            {
                return segments[segments.Length-1].ToLower().Replace('\\', '/').TrimEnd("/") == "services";
            }
        }

    }

}
