using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AtomicNet
{

    public
    abstract    class   HostServerUtility : Atom<HostServerUtility>
    {

        //
        // Summary:
        //     Returns the physical file path that corresponds to the specified virtual
        //     path on the Web server.
        //
        // Parameters:
        //   path:
        //     The virtual path of the Web server.
        //
        // Returns:
        //     The physical file path that corresponds to path.
        //
        // Exceptions:
        //   System.Web.HttpException:
        //     The current System.Web.HttpContext is null.
        public
        abstract    string  MapPath(string path);

    }

}
