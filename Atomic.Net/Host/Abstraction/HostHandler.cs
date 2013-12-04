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
                .Then(handler=>handler.ProcessRequest(context), reject)
                .WhenDone(resolve, reject);
            });
        }

    }

}
