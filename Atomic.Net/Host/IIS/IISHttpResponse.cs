using System;
using System.Text;
using System.Web;

namespace AtomicNet.IIS
{

    public  class IISHttpResponse : HostResponse
    {

        protected
        new             IISHttpContext      context                                                 { get { return (IISHttpContext) base.context; } }

        private         HttpResponse        response                                                { get { return this.context.context.Response; } }

        public                              IISHttpResponse(IISHttpContext context) : base(context) {}

        [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverage]
        [Obsolete("This constructor is for mocking purposes only.")]
        internal                            IISHttpResponse() : base()                              {}

        public
        override        bool                Buffer                                                  { get { return this.response.Buffer; } set { this.response.Buffer = value; } }

        public
        override        bool                BufferOutput                                            { get { return this.response.BufferOutput; } set {this.response.BufferOutput = value; } }

        public
        override        string              CacheControl                                            { get { return this.response.CacheControl; } set { this.response.CacheControl = value; } }

        public
        override        string              Charset                                                 { get { return this.response.Charset; } set { this.response.Charset = value; } }

        public
        override        Encoding            ContentEncoding                                         { get { return this.response.ContentEncoding; } set { this.response.ContentEncoding = value; } }

        public
        override        string              ContentType                                             { get { return this.response.ContentType; } set { this.response.ContentType = value; } }

        public
        override        Dictionary
                        <
                            string,
                            HostCookie
                        >                   Cookies                                                 { get { return this.response.Cookies.ConvertToDictionary(); } }

        public
        override        int                 Expires                                                 { get { return this.response.Expires; } set { this.response.Expires = value; } }

        public
        override        DateTime            ExpiresAbsolute                                         { get { return this.response.ExpiresAbsolute; } set { this.response.ExpiresAbsolute = value; } }

        public
        override        System.IO.Stream    Filter                                                  { get { return this.response.Filter; } set { this.response.Filter = value; } }

        public
        override        Encoding            HeaderEncoding                                          { get { return this.response.HeaderEncoding; } set { this.response.HeaderEncoding = value; } }

        public
        override        Dictionary
                        <
                            string,
                            string
                        >                   Headers                                                 { get { return this.response.Headers.ConvertToDictionary(); } }

        public
        override        bool                IsClientConnected                                       { get { return this.response.IsClientConnected; } }

        public
        override        System.IO
                        .TextWriter         Output                                                  { get { return this.response.Output; } set { this.response.Output = value; } }

        public
        override        System.IO.Stream    OutputStream                                            { get { return this.response.OutputStream; } }

        public
        override        string              RedirectLocation                                        { get { return this.response.RedirectLocation; } set { this.response.RedirectLocation = value; } }

        public
        override        string              Status                                                  { get { return this.response.Status; } set { this.response.Status = value; } }

        public
        override        int                 StatusCode                                              { get { return this.response.StatusCode; } set { this.response.StatusCode = value; } }

        public
        override        string              StatusDescription                                       { get { return this.response.StatusDescription; } set { this.response.StatusDescription = value; } }

        public
        override        int                 SubStatusCode                                           { get { return this.response.SubStatusCode; } set { this.response.SubStatusCode = value; } }

        public
        override        bool                SuppressContent                                         { get { return this.response.SuppressContent; } set { this.response.SuppressContent = value; } }

        protected
        override        void                addHeader(string name, string value)                    { this.response.AddHeader(name, value); }

        protected
        override        void                appendCookie(HostCookie cookie)                         { this.response.AppendCookie(((IISHttpCookie) cookie).Cookie); }

        protected
        override        void                appendHeader(string name, string value)                 { this.response.AppendHeader(name, value); }

        protected
        override        void                binaryWrite(byte[] buffer)                              { this.response.BinaryWrite(buffer); }

        protected
        override        void                clear()                                                 { this.response.Clear(); }

        protected
        override        void                clearHeaders()                                          { this.response.ClearHeaders(); }

        protected
        override        void                close()                                                 { this.response.Close(); }

        protected
        override        void                end()                                                   { this.response.End(); }

        protected
        override        void                flush()                                                 { this.response.Flush(); }

        protected
        override        void                redirect(string url)                                    { this.response.Redirect(url); }

        protected
        override        void                redirect(string url, bool endResponse)                  { this.Redirect(url, endResponse); }

        protected
        override        void                redirectPermanent(string url)                           { this.response.RedirectPermanent(url); }

        protected
        override        void                redirectPermanent
                                            (
                                                string  url,
                                                bool    endResponse
                                            )                                                       { this.response.RedirectPermanent(url, endResponse); }

        protected
        override        void                setCookie(HostCookie cookie)                            { this.response.SetCookie(((IISHttpCookie) cookie).Cookie); }

        protected
        override        void                transmitFile(string filename)                           { this.response.TransmitFile(filename); }

        protected
        override        void                transmitFile
                                            (
                                                string  filename,
                                                long    offset,
                                                long    length
                                            )                                                       { this.response.TransmitFile(filename, offset, length); }

        protected
        override        void                write(char ch)                                          { this.response.Write(ch); }

        protected
        override        void                write(object obj)                                       { this.response.Write(obj); }

        protected
        override        void                write(string s)                                         { this.response.Write(s); }

        protected
        override        void                write
                                            (
                                                char[]  buffer,
                                                int     index,
                                                int     count
                                            )                                                       { this.response.Write(buffer, index, count); }

        protected
        override        void                writeFile(string filename)                              { this.response.WriteFile(filename); }

        protected
        override        void                writeFile
                                            (
                                                string  filename,
                                                bool    readIntoMemory
                                            )                                                       { this.response.WriteFile(filename, readIntoMemory); }

        protected
        override        void                writeFile
                                            (
                                                IntPtr  fileHandle,
                                                long    offset,
                                                long    size
                                            )                                                       { this.response.WriteFile(fileHandle, offset, size); }

        protected
        override        void                writeFile
                                            (
                                                string  filename,
                                                long    offset,
                                                long    size
                                            )                                                       { this.response.WriteFile(filename, offset, size); }

        protected
        override        void                writeSubstitution
                                            (
                                                HostResponse
                                                .HostResponseSubstitutionCallback   callback
                                            )                                                       { this.response.WriteSubstitution(context=>callback(new IISHttpContext(context))); }
    }

}
