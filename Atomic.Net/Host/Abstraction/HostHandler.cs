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
                WebHandler.Router.Instance.Map(context)
                .Then(handler=>handler.ProcessRequest(context), reject)
                .WhenDone(resolve, reject);
            });
        }

    }

}
