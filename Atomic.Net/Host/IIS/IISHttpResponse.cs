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
        new             IISHttpContext      context                                 { get { return (IISHttpContext) base.context; } }

        private         HttpResponse        response                                { get { return this.context.context.Response; } }

        public                              IISHttpResponse(IISHttpContext context) : base(context) {}


        public override bool Buffer
        {
            get
            {
                throw new NotImplementedException();
            }
            set
            {
                throw new NotImplementedException();
            }
        }

        public override bool BufferOutput
        {
            get
            {
                throw new NotImplementedException();
            }
            set
            {
                throw new NotImplementedException();
            }
        }

        public override string CacheControl
        {
            get
            {
                throw new NotImplementedException();
            }
            set
            {
                throw new NotImplementedException();
            }
        }

        public override string Charset
        {
            get
            {
                throw new NotImplementedException();
            }
            set
            {
                throw new NotImplementedException();
            }
        }

        public override Encoding ContentEncoding
        {
            get
            {
                throw new NotImplementedException();
            }
            set
            {
                throw new NotImplementedException();
            }
        }

        public override string ContentType
        {
            get
            {
                throw new NotImplementedException();
            }
            set
            {
                throw new NotImplementedException();
            }
        }

        public override Dictionary<string, HostCookie> Cookies
        {
            get
            {
                throw new NotImplementedException();
            }
        }

        public override int Expires
        {
            get
            {
                throw new NotImplementedException();
            }
            set
            {
                throw new NotImplementedException();
            }
        }

        public override DateTime ExpiresAbsolute
        {
            get
            {
                throw new NotImplementedException();
            }
            set
            {
                throw new NotImplementedException();
            }
        }

        public override System.IO.Stream Filter
        {
            get
            {
                throw new NotImplementedException();
            }
            set
            {
                throw new NotImplementedException();
            }
        }

        public override Encoding HeaderEncoding
        {
            get
            {
                throw new NotImplementedException();
            }
            set
            {
                throw new NotImplementedException();
            }
        }

        public override Dictionary<string, string> Headers
        {
            get
            {
                throw new NotImplementedException();
            }
        }

        public override bool IsClientConnected
        {
            get
            {
                throw new NotImplementedException();
            }
        }

        public override System.IO.TextWriter Output
        {
            get
            {
                throw new NotImplementedException();
            }
            set
            {
                throw new NotImplementedException();
            }
        }

        public override System.IO.Stream OutputStream
        {
            get
            {
                throw new NotImplementedException();
            }
        }

        public override string RedirectLocation
        {
            get
            {
                throw new NotImplementedException();
            }
            set
            {
                throw new NotImplementedException();
            }
        }

        public override string Status
        {
            get
            {
                throw new NotImplementedException();
            }
            set
            {
                throw new NotImplementedException();
            }
        }

        public override int StatusCode
        {
            get
            {
                throw new NotImplementedException();
            }
            set
            {
                throw new NotImplementedException();
            }
        }

        public override string StatusDescription
        {
            get
            {
                throw new NotImplementedException();
            }
            set
            {
                throw new NotImplementedException();
            }
        }

        public override int SubStatusCode
        {
            get
            {
                throw new NotImplementedException();
            }
            set
            {
                throw new NotImplementedException();
            }
        }

        public override bool SupportsAsyncFlush
        {
            get
            {
                throw new NotImplementedException();
            }
        }

        public override bool SuppressContent
        {
            get
            {
                throw new NotImplementedException();
            }
            set
            {
                throw new NotImplementedException();
            }
        }

        public override void AddHeader(string name, string value)
        {
            throw new NotImplementedException();
        }

        public override void AppendCookie(KeyValuePair<string, HostCookie> cookie)
        {
            throw new NotImplementedException();
        }

        public override void AppendHeader(string name, string value)
        {
            throw new NotImplementedException();
        }

        public override IAsyncResult BeginFlush(AsyncCallback callback, object state)
        {
            throw new NotImplementedException();
        }

        public override void BinaryWrite(byte[] buffer)
        {
            throw new NotImplementedException();
        }

        public override void Clear()
        {
            throw new NotImplementedException();
        }

        public override void ClearHeaders()
        {
            throw new NotImplementedException();
        }

        public override void Close()
        {
            throw new NotImplementedException();
        }

        public override void End()
        {
            throw new NotImplementedException();
        }

        public override void EndFlush(IAsyncResult asyncResult)
        {
            throw new NotImplementedException();
        }

        public override void Flush()
        {
            throw new NotImplementedException();
        }

        public override void Redirect(string url)
        {
            throw new NotImplementedException();
        }

        public override void Redirect(string url, bool endResponse)
        {
            throw new NotImplementedException();
        }

        public override void RedirectPermanent(string url)
        {
            throw new NotImplementedException();
        }

        public override void RedirectPermanent(string url, bool endResponse)
        {
            throw new NotImplementedException();
        }

        public override void SetCookie(HostCookie cookie)
        {
            throw new NotImplementedException();
        }

        public override void TransmitFile(string filename)
        {
            throw new NotImplementedException();
        }

        public override void TransmitFile(string filename, long offset, long length)
        {
            throw new NotImplementedException();
        }

        public override void Write(char ch)
        {
            throw new NotImplementedException();
        }

        public override void Write(object obj)
        {
            throw new NotImplementedException();
        }

        public override void Write(string s)
        {
            throw new NotImplementedException();
        }

        public override void Write(char[] buffer, int index, int count)
        {
            throw new NotImplementedException();
        }

        public override void WriteFile(string filename)
        {
            throw new NotImplementedException();
        }

        public override void WriteFile(string filename, bool readIntoMemory)
        {
            throw new NotImplementedException();
        }

        public override void WriteFile(IntPtr fileHandle, long offset, long size)
        {
            throw new NotImplementedException();
        }

        public override void WriteFile(string filename, long offset, long size)
        {
            throw new NotImplementedException();
        }

        public override void WriteSubstitution(HostResponse.HostResponseSubstitutionCallback callback)
        {
            throw new NotImplementedException();
        }
    }

}
