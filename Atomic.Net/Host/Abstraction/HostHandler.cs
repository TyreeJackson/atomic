namespace AtomicNet
{

    public
    abstract    class   HostHandler : Atom<HostHandler>
    {

        public      Promise ProcessRequest(HostContext context)
        {
            return Atomic.Promise
            ((resolve, reject)=>
            {
                AtomicHandler.Router.Instance.Map(context.Request.Path)
                .ProcessRequest(context)
                .WhenDone(resolve, reject);
            });
        }

    }

}
