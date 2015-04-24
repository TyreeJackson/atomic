using System;
using System.Collections.Generic;
using System.Text;
using System.Web;

namespace AtomicNet.IIS
{

    public  class IISHttpRequest : HostRequest
    {

        protected
        new             IISHttpContext      context                                 { get { return (IISHttpContext) base.context; } }

        private         HttpRequest         request                                 { get { return this.context.context.Request; } }

        public                              IISHttpRequest(IISHttpContext context) : base(context) {}

        [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverage]
        [Obsolete("This constructor is for mocking purposes only.")]
        internal                            IISHttpRequest() : base() {}

        public
        override    List<string>            AcceptTypes                             { get { return new List<string>(this.request.AcceptTypes); } }

        public
        override    string                  ApplicationPath                         { get { return this.request.ApplicationPath; } }

        public
        override    string                  AppRelativeCurrentExecutionFilePath     { get { return this.request.AppRelativeCurrentExecutionFilePath; } }

        public
        override    Encoding                ContentEncoding                         { get { return this.request.ContentEncoding; } set { this.request.ContentEncoding = value; } }

        public
        override    int                     ContentLength                           { get { return this.request.ContentLength; } }

        public
        override    string                  ContentType                             { get { return this.request.ContentType; } set { this.request.ContentType = value; } }

        public
        override    Dictionary
                    <
                        string,
                        HostCookie
                    >                       Cookies                                 { get { return this.request.Cookies.ConvertToDictionary(); } }

        public
        override    string                  CurrentExecutionFilePath                { get { return this.request.CurrentExecutionFilePath; }  }

        public
        override    string                  FilePath                                { get { return this.request.FilePath; } }

        public
        override    List<TransferredFile>   Files
        {
            get
            {
                    #warning NotImplemented
                    throw new NotImplementedException();
            }
        }

        public
        override    Dictionary
                    <
                        string,
                        string
                    >                       Form                                    { get { return this.request.Form.ConvertToDictionary(); } }

        public
        override    Dictionary
                    <
                        string,
                        string
                    >                       Headers                                 { get { return this.request.Headers.ConvertToDictionary(); } }

        public
        override    string                  HttpMethod                              { get { return this.request.HttpMethod; } }

        public
        override    System
                    .IO.Stream              InputStream                             { get { return this.request.InputStream; } }

        public
        override    bool                    IsLocal                                 { get { return this.request.IsLocal; } }

        public
        override    bool                    IsSecureConnection                      { get { return this.request.IsSecureConnection; } }

        public
        override    string                  Path                                    { get { return this.request.Path; } }

        public
        override    string                  PhysicalApplicationPath                 { get { return this.request.PhysicalApplicationPath; } }

        public
        override    string                  PhysicalPath                            { get { return this.request.PhysicalPath; } }

        public
        override    Dictionary
                    <
                        string,
                        string
                    >                       QueryString                             { get { return this.request.QueryString.ConvertToDictionary(); } }

        public
        override    string                  RawUrl                                  { get { return this.request.RawUrl; } }

        public
        override    string                  RequestType                             { get { return this.request.RequestType; } }

        public
        override    Dictionary
                    <
                        string,             
                        string
                    >                       ServerVariables                         { get { return this.request.ServerVariables.ConvertToDictionary(); } }

        public
        override    int                     TotalBytes                              { get { return this.request.TotalBytes; } }

        public
        override    Uri                     Url                                     { get { return this.request.Url; } }

        public
        override    Uri                     UrlReferrer                             { get { return this.request.UrlReferrer; } }

        public
        override    string                  UserAgent                               { get { return this.request.UserAgent; } }

        public
        override    string                  UserHostAddress                         { get { return this.request.UserHostAddress; } }

        public
        override    string                  UserHostName                            { get { return this.request.UserHostName; } }

        public
        override    List<string>            UserLanguages                           { get { return new List<string>(this.request.UserLanguages); } }

    }

}
