using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AtomicStack
{

    public
    abstract    class   HostRequest : Atom<HostRequest>
    {

        public
        abstract    List<string>            AcceptTypes                         { get; }

        public
        abstract    string                  ApplicationPath                     { get; }

        public
        abstract    string                  AppRelativeCurrentExecutionFilePath { get; }

        public
        abstract    Encoding                ContentEncoding                     { get; set; }

        public
        abstract    int                     ContentLength                       { get; }

        public
        abstract    string                  ContentType                         { get; set; }

        public
        abstract    Dictionary
                    <
                        string,
                        string
                    >                       Cookies                             { get; }

        public
        abstract    string                  CurrentExecutionFilePath            { get; }

        public
        abstract    string                  FilePath                            { get; }

        public
        abstract    List<TransferredFile>   Files                               { get; }

        public
        abstract    Dictionary
                    <
                        string,
                        string
                    >                       Form                                { get; }

        public
        abstract    Dictionary
                    <
                        string,
                        string
                    >                       Headers                             { get; }

        public
        abstract    string                  HttpMethod                          { get; }

        public
        abstract    System
                    .IO.Stream              InputStream                         { get; }

        public
        abstract    bool                    IsLocal                             { get; }

        public
        abstract    bool                    IsSecureConnection                  { get; }

        public
        abstract    string                  Path                                { get; }

        public
        abstract    string                  PhysicalApplicationPath             { get; }

        public
        abstract    string                  PhysicalPath                        { get; }

        public
        abstract    Dictionary
                    <
                        string,
                        string
                    >                       QueryString                         { get; }

        public
        abstract    string                  RawUrl                              { get; }

        public
        abstract    string                  RequestType                         { get; }

        public
        abstract    Dictionary
                    <
                        string,             
                        string
                    >                       ServerVariables                     { get; }

        public
        abstract    int                     TotalBytes                          { get; }

        public
        abstract    Uri                     Url                                 { get; }

        public
        abstract    Uri                     UrlReferrer                         { get; }

        public
        abstract    string                  UserAgent                           { get; }

        public
        abstract    string                  UserHostAddress                     { get; }

        public
        abstract    string                  UserHostName                        { get; }

        public
        abstract    List<string>            UserLanguages                       { get; }

        public
        abstract    void                    Abort();

    }

}
