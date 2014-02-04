using System.Threading.Tasks;
namespace AtomicNet
{

    public
    abstract    class   HostHandler : Atom<HostHandler>
    {

        public
        async   Task    ProcessRequest(HostContext context)
        {
            await (await WebHandler.Router.Instance.Map(context)).ProcessRequest(context);
        }

    }

}
