using AtomicNet;

namespace AtomicNet
{

    public  class   IfIts : IntegerEnum<IfIts>
    {

        private                     System.Func
                                    <
                                        System.IComparable,
                                        System.IComparable,
                                        bool
                                    >                       comparer;
        public  static  readonly    IfIts                   Equal               = new IfIts(0, (a,b)=>a.CompareTo(b)==0);
        public  static  readonly    IfIts                   Greater             = new IfIts(1, (a,b)=>a.CompareTo(b)<0);
        public  static  readonly    IfIts                   GreaterThanOrEqual  = new IfIts(2, (a,b)=>a.CompareTo(b)<=0);
        public  static  readonly    IfIts                   LessThan            = new IfIts(3, (a,b)=>a.CompareTo(b)>0);
        public  static  readonly    IfIts                   LessThanOrEqual     = new IfIts(4, (a,b)=>a.CompareTo(b)>=0);
        protected   IfIts(int naturalValue, System.Func<System.IComparable, System.IComparable, bool> comparer) : base(naturalValue){ this.comparer = comparer; }

        public  bool    IsTrue<t>(t a, t b) where t : System.IComparable
        {
            return this.comparer(a, b);
        }

    }

    public
    static  class   StructExtensions
    {

        public
        static  bool    IsOneOf<t>(this t thisItem, params t[] values) where t : System.IEquatable<t>
        {
            foreach(t value in values)  if (thisItem.Equals(value)) return true;
            return  false;
        }

        public
        static  bool    IsOneOf<t>(this t thisItem, System.Collections.Generic.IEnumerable<t> values) where t : System.IEquatable<t>
        {
            foreach(t value in values)  if (thisItem.Equals(value)) return true;
            return  false;
        }

        public
        static  t       Or<t>(this t thisItem, t otherwise, IfIts ifIts) where t : System.IComparable
        {
            return ifIts.IsTrue(thisItem, otherwise) ? otherwise : thisItem;
        }

    }

}
