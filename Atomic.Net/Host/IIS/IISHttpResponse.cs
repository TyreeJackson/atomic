using System;
using System.Collections.Generic;
using System.Text;
using System.Web;
using AtomicNet;

namespace AtomicNet.IIS
{

    public  class IISHttpResponse : HostResponse
    {

        protected
        new             IISHttpContext      context                                             { get { return (IISHttpContext) base.context; } }

        private         HttpResponse        response                                            { get { return this.context.context.Response; } }

        public                              IISHttpResponse(IISHttpContext context)             : base(context) {}

        public
        override        bool                Buffer                                              { get { return this.response.Buffer; } set { this.response.Buffer = value; } }

        public
        override        bool                BufferOutput                                        { get { return this.response.BufferOutput; } set {this.response.BufferOutput = value; } }

        public
        override        string              CacheControl                                        { get { return this.response.CacheControl; } set { this.response.CacheControl = value; } }

        public
        override        string              Charset                                             { get { return this.response.Charset; } set { this.response.Charset = value; } }

        public
        override        Encoding            ContentEncoding                                     { get { return this.response.ContentEncoding; } set { this.response.ContentEncoding = value; } }

        public
        override        string              ContentType                                         { get { return this.response.ContentType; } set { this.response.ContentType = value; } }

        public
        override        Dictionary
                        <
                            string,
                            HostCookie
                        >                   Cookies                                             { get { return this.response.Cookies.ConvertToDictionary(); } }

        public
        override        int                 Expires                                             { get { return this.response.Expires; } set { this.response.Expires = value; } }

        public
        override        DateTime            ExpiresAbsolute                                     { get { return this.response.ExpiresAbsolute; } set { this.response.ExpiresAbsolute = value; } }

        public
        override        System.IO.Stream    Filter                                              { get { return this.response.Filter; } set { this.response.Filter = value; } }

        public
        override        Encoding            HeaderEncoding                                      { get { return this.response.HeaderEncoding; } set { this.response.HeaderEncoding = value; } }

        public
        override        Dictionary
                        <
                            string,
                            string
                        >                   Headers                                             { get { return this.response.Headers.ConvertToDictionary(); } }

        public
        override        bool                IsClientConnected                                   { get { return this.response.IsClientConnected; } }

        public
        override        System.IO
                        .TextWriter         Output                                              { get { return this.response.Output; } set { this.response.Output = value; } }

        public
        override        System.IO.Stream    OutputStream                                        { get { return this.response.OutputStream; } }

        public
        override        string              RedirectLocation                                    { get { return this.response.RedirectLocation; } set { this.response.RedirectLocation = value; } }

        public
        override        string              Status                                              { get { return this.response.Status; } set { this.response.Status = value; } }

        public
        override        int                 StatusCode                                          { get { return this.response.StatusCode; } set { this.response.StatusCode = value; } }

        public
        override        string              StatusDescription                                   { get { return this.response.StatusDescription; } set { this.response.StatusDescription = value; } }

        public
        override        int                 SubStatusCode                                       { get { return this.response.SubStatusCode; } set { this.response.SubStatusCode = value; } }

        public
        override        bool                SupportsAsyncFlush                                  { get { return this.response.SupportsAsyncFlush; } }

        public
        override        bool                SuppressContent                                     { get { return this.response.SuppressContent; } set { this.response.SuppressContent = value; } }

        public
        override        void                AddHeader(string name, string value)                { this.response.AddHeader(name, value); }

        public
        override        void                AppendCookie(HostCookie cookie)                     { this.response.AppendCookie(((IISHttpCookie) cookie).Cookie); }

        public
        override        void                AppendHeader(string name, string value)             { this.response.AppendHeader(name, value); }

        public
        override        IAsyncResult        BeginFlush
                                            (
                                                AsyncCallback   callback,
                                                object          state
                                            )                                                   { return this.response.BeginFlush(callback, state); }

        public
        override        void                BinaryWrite(byte[] buffer)                          { this.response.BinaryWrite(buffer); }

        public
        override        void                Clear()                                             { this.response.Clear(); }

        public
        override        void                ClearHeaders()                                      { this.response.ClearHeaders(); }

        public
        override        void                Close()                                             { this.response.Close(); }

        public
        override        void                End()                                               { this.response.End(); }

        public
        override        void                EndFlush(IAsyncResult asyncResult)                  { this.response.EndFlush(asyncResult); }

        public
        override        void                Flush()                                             { this.response.Flush(); }

        public
        override        void                Redirect(string url)                                { this.response.Redirect(url); }

        public
        override        void                Redirect(string url, bool endResponse)              { this.Redirect(url, endResponse); }

        public
        override        void                RedirectPermanent(string url)                       { this.response.RedirectPermanent(url); }

        public
        override        void                RedirectPermanent
                                            (
                                                string  url,
                                                bool    endResponse
                                            )                                                   { this.response.RedirectPermanent(url, endResponse); }

        public
        override        void                SetCookie(HostCookie cookie)                        { this.response.SetCookie(((IISHttpCookie) cookie).Cookie); }

        public
        override        void                TransmitFile(string filename)                       { this.response.TransmitFile(filename); }

        public
        override        void                TransmitFile
                                            (
                                                string  filename,
                                                long    offset,
                                                long    length
                                            )                                                   { this.response.TransmitFile(filename, offset, length); }

        public
        override        void                Write(char ch)                                      { this.response.Write(ch); }

        public
        override        void                Write(object obj)                                   { this.response.Write(obj); }

        public
        override        void                Write(string s)                                     { this.response.Write(s); }

        public
        override        void                Write
                                            (
                                                char[]  buffer,
                                                int     index,
                                                int     count
                                            )                                                   { this.response.Write(buffer, index, count); }

        public
        override        void                WriteFile(string filename)                          { this.response.WriteFile(filename); }

        public
        override        void                WriteFile
                                            (
                                                string  filename,
                                                bool    readIntoMemory
                                            )                                                   { this.response.WriteFile(filename, readIntoMemory); }

        public
        override        void                WriteFile
                                            (
                                                IntPtr  fileHandle,
                                                long    offset,
                                                long    size
                                            )                                                   { this.response.WriteFile(fileHandle, offset, size); }

        public
        override        void                WriteFile
                                            (
                                                string  filename,
                                                long    offset,
                                                long    size
                                            )                                                   { this.response.WriteFile(filename, offset, size); }

        public
        override        void                WriteSubstitution
                                            (
                                                HostResponse
                                                .HostResponseSubstitutionCallback   callback
                                            )                                                   { this.response.WriteSubstitution(context=>callback(new IISHttpContext(context))); }
    }

}
