using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AtomicNet
{

    public
    abstract    class   HostResponse : Atom<HostResponse, HostContext>
    {

        public
        delegate    string                  HostResponseSubstitutionCallback(HostContext context);

        protected
        readonly    HostContext             context                             = null;

        public
        abstract    bool                    Buffer
        {
            get;
            set;
        }

        public
        abstract    bool                    BufferOutput
        {
            get;
            set;
        }

        public
        abstract    string                  CacheControl
        {
            get;
            set;
        }

        public
        abstract    string                  Charset
        {
            get;
            set;
        }

        public
        abstract    Encoding                ContentEncoding
        {
            get;
            set;
        }

        public
        abstract    string                  ContentType
        {
            get;
            set;
        }

        public
        abstract    Dictionary
                    <
                        string,
                        HostCookie
                    >                       Cookies
        {
            get;
        }

        public
        abstract    int                     Expires
        {
            get;
            set;
        }

        public
        abstract    DateTime                ExpiresAbsolute
        {
            get;
            set;
        }

        public
        abstract    System.IO.Stream        Filter
        {
            get;
            set;
        }

        public
        abstract    Encoding                HeaderEncoding
        {
            get;
            set;
        }

        public
        abstract    Dictionary
                    <
                        string,
                        string
                    >                       Headers
        {
            get;
        }

        public
        abstract    bool                    IsClientConnected
        {
            get;
        }

        public
        abstract    System.IO.TextWriter    Output
        {
            get;
            set;
        }

        public
        abstract    System.IO.Stream        OutputStream
        {
            get;
        }

        public
        abstract    string                  RedirectLocation
        {
            get;
            set;
        }

        public
        abstract    string                  Status
        {
            get;
            set;
        }

        public
        abstract    int                     StatusCode
        {
            get;
            set;
        }

        public
        abstract    string                  StatusDescription
        {
            get;
            set;
        }

        public
        abstract    int                     SubStatusCode
        {
            get;
            set;
        }

        public
        abstract    bool                    SupportsAsyncFlush
        {
            get;
        }

        public
        abstract    bool                    SuppressContent
        {
            get;
            set;
        }

        public                              HostResponse(HostContext context) : base(context)
        {
            Throw<ArgumentNullException>.If(context==null, "context");
            this.context    = context;
        }


        public
        abstract    void                    AddHeader(string name, string value);

        public
        abstract    void                    AppendCookie(KeyValuePair<string, HostCookie> cookie);

        public
        abstract    void                    AppendHeader(string name, string value);

        public
        abstract    IAsyncResult            BeginFlush(AsyncCallback callback, object state);

        public
        abstract    void                    BinaryWrite(byte[] buffer);

        public
        abstract    void                    Clear();

        public
        abstract    void                    ClearHeaders();

        public
        abstract    void                    Close();

        public
        abstract    void                    End();

        public
        abstract    void                    EndFlush(IAsyncResult asyncResult);

        public
        abstract    void                    Flush();

        public
        abstract    void                    Redirect(string url);

        public
        abstract    void                    Redirect(string url, bool endResponse);

        public
        abstract    void                    RedirectPermanent(string url);

        public
        abstract    void                    RedirectPermanent(string url, bool endResponse);

        public
        abstract    void                    SetCookie(HostCookie cookie);

        public
        abstract    void                    TransmitFile(string filename);

        public
        abstract    void                    TransmitFile(string filename, long offset, long length);

        public
        abstract    void                    Write(char ch);

        public
        abstract    void                    Write(object obj);

        public
        abstract    void                    Write(string s);

        public
        abstract    void                    Write(char[] buffer, int index, int count);

        public
        abstract    void                    WriteFile(string filename);

        public
        abstract    void                    WriteFile(string filename, bool readIntoMemory);

        public
        abstract    void                    WriteFile(IntPtr fileHandle, long offset, long size);

        public
        abstract    void                    WriteFile(string filename, long offset, long size);

        public
        abstract    void                    WriteSubstitution(HostResponseSubstitutionCallback callback);

    }

}
