using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Security.Principal;

namespace AtomicNet
{

    public  class   IISHostPrincipal : HostPrincipal
    {

        private     IPrincipal                          user                                                    { get; set; }
        private     Func<IIdentity, IISHostIdentity>    createIdentity                                          { get; set; }
        private     IISHostIdentity                     identity;
        public
        override    HostIdentity                        Identity
        {
            get
            {
                if (this.identity == null)  this.identity = this.createIdentity(this.user.Identity);
                return this.identity;
            }
        }


        public                                          IISHostPrincipal(IPrincipal user)
        :
                                                        this(user, identity=>new IISHostIdentity(identity))     {}

        [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverage]
        [Obsolete("This constructor is for mocking purposes only.")]
        internal                                        IISHostPrincipal() : this(null) {}

        public                                          IISHostPrincipal
                                                        (
                                                            IPrincipal                          user,
                                                            Func<IIdentity, IISHostIdentity>    createIdentity
                                                        )
        {
            this.user           = user;
            this.createIdentity = createIdentity;
        }

        public
        override    bool                                IsInRole(string role)                                   { return this.user.IsInRole(role); }

    }

}
