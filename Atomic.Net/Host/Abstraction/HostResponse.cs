using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AtomicNet
{

    public
    abstract    class   HostResponse : Atom<HostResponse>
    {

        public
        delegate    string                  HostResponseSubstitutionCallback(HostContext context);

        protected
        readonly    HostContext             context                             = null;

        public
        abstract    bool                    Buffer                              { get; set; }

        public
        abstract    bool                    BufferOutput                        { get; set; }

        public
        abstract    string                  CacheControl                        { get; set; }

        public
        abstract    string                  Charset                             { get; set; }

        public
        abstract    Encoding                ContentEncoding                     { get; set; }

        public
        abstract    string                  ContentType                         { get; set; }

        public
        abstract    Dictionary
                    <
                        string,
                        HostCookie
                    >                       Cookies                             { get; }

        public
        abstract    int                     Expires                             { get; set; }

        public
        abstract    DateTime                ExpiresAbsolute                     { get; set; }

        public
        abstract    System.IO.Stream        Filter                              { get; set; }

        public
        abstract    Encoding                HeaderEncoding                      { get; set; }

        public
        abstract    Dictionary
                    <
                        string,
                        string
                    >                       Headers                             { get; }

        public
        abstract    bool                    IsClientConnected                   { get; }

        public
        abstract    System.IO.TextWriter    Output                              { get; set; }

        public
        abstract    System.IO.Stream        OutputStream                        { get; }

        public
        abstract    string                  RedirectLocation                    { get; set; }

        public
        abstract    string                  Status                              { get; set; }

        public
        abstract    int                     StatusCode                          { get; set; }

        public
        abstract    string                  StatusDescription                   { get; set; }

        public
        abstract    int                     SubStatusCode                       { get; set; }

        public
        abstract    bool                    SuppressContent                     { get; set; }

        public                              HostResponse(HostContext context)
        {
            Throw<ArgumentNullException>.If(context==null, "context");
            this.context    = context;
        }

        [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverage]
        [Obsolete("This constructor is for mocking purposes only.")]
        internal                            HostResponse()                      {}

        protected
        abstract    void                    addHeader(string name, string value);

        protected
        abstract    void                    appendCookie(HostCookie cookie);

        protected
        abstract    void                    appendHeader(string name, string value);

        protected
        abstract    void                    binaryWrite(byte[] buffer);

        protected
        abstract    void                    clear();

        protected
        abstract    void                    clearHeaders();

        protected
        abstract    void                    close();

        protected
        abstract    void                    end();

        protected
        abstract    void                    flush();

        protected
        abstract    void                    redirect(string url);

        protected
        abstract    void                    redirect(string url, bool endResponse);

        protected
        abstract    void                    redirectPermanent(string url);

        protected
        abstract    void                    redirectPermanent(string url, bool endResponse);

        protected
        abstract    void                    setCookie(HostCookie cookie);

        protected
        abstract    void                    transmitFile(string filename);

        protected
        abstract    void                    transmitFile(string filename, long offset, long length);

        protected
        abstract    void                    write(char ch);

        protected
        abstract    void                    write(object obj);

        protected
        abstract    void                    write(string s);

        protected
        abstract    void                    write(char[] buffer, int index, int count);

        protected
        abstract    void                    writeFile(string filename);

        protected
        abstract    void                    writeFile(string filename, bool readIntoMemory);

        protected
        abstract    void                    writeFile(IntPtr fileHandle, long offset, long size);

        protected
        abstract    void                    writeFile(string filename, long offset, long size);

        protected
        abstract    void                    writeSubstitution(HostResponseSubstitutionCallback callback);

        public      HostResponse            AddHeader(string name, string value)                            { this.addHeader(name, value); return this; }

        public      HostResponse            AppendCookie(HostCookie cookie)                                 { this.appendCookie(cookie); return this; }

        public      HostResponse            AppendHeader(string name, string value)                         { this.appendHeader(name, value); return this; }

        public      HostResponse            BinaryWrite(byte[] buffer)                                      { this.binaryWrite(buffer); return this; }

        public      HostResponse            Clear()                                                         { this.clear(); return this; }

        public      HostResponse            ClearHeaders()                                                  { this.clearHeaders(); return this; }

        public      HostResponse            Close()                                                         { this.close(); return this; }

        public      HostResponse            End()                                                           { this.end(); return this; }

        public      HostResponse            Flush()                                                         { this.flush(); return this; }

        public      HostResponse            Redirect(string url)                                            { this.redirect(url); return this; }

        public      HostResponse            Redirect(string url, bool endResponse)                          { this.redirect(url, endResponse); return this; }

        public      HostResponse            RedirectPermanent(string url)                                   { this.redirectPermanent(url); return this; }

        public      HostResponse            RedirectPermanent(string url, bool endResponse)                 { this.redirectPermanent(url, endResponse); return this; }

        public      HostResponse            SetCookie(HostCookie cookie)                                    { this.setCookie(cookie); return this; }

        public      HostResponse            TransmitFile(string filename)                                   { this.transmitFile(filename); return this; }

        public      HostResponse            TransmitFile(string filename, long offset, long length)         { this.transmitFile(filename, offset, length); return this; }

        public      HostResponse            Write(char ch)                                                  { this.write(ch); return this; }

        public      HostResponse            Write(object obj)                                               { this.write(obj); return this; }

        public      HostResponse            Write(string s)                                                 { this.write(s); return this; }

        public      HostResponse            Write(char[] buffer, int index, int count)                      { this.write(buffer, index, count); return this; }

        public      HostResponse            WriteFile(string filename)                                      { this.writeFile(filename); return this; }

        public      HostResponse            WriteFile(string filename, bool readIntoMemory)                 { this.writeFile(filename, readIntoMemory); return this; }

        public      HostResponse            WriteFile(IntPtr fileHandle, long offset, long size)            { this.writeFile(fileHandle, offset, size); return this; }

        public      HostResponse            WriteFile(string filename, long offset, long size)              { this.writeFile(filename, offset, size); return this; }

        public      HostResponse            WriteSubstitution(HostResponseSubstitutionCallback callback)    { this.writeSubstitution(callback); return this; }

    }

}
