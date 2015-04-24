using EditorBrowsableAttribute  = System.ComponentModel.EditorBrowsableAttribute;
using EditorBrowsableState      = System.ComponentModel.EditorBrowsableState;

namespace AtomicNet
{   partial class   Entity<tEntity, tCriteria, tModification, tSelection>
{   partial class   EntityCriteria
{

    [EditorBrowsable(EditorBrowsableState.Never)]
    public  class   BehalfOfRouter : Atom<BehalfOfRouter>
    {

        private tCriteria   criteria;

        internal            BehalfOfRouter(tCriteria criteria) { this.criteria = criteria; }

        public  tCriteria   Where                              { get { return this.criteria; } }

    }

}}}
