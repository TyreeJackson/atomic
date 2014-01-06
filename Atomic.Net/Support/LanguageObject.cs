using System;
using EditorBrowsableAttribute  = System.ComponentModel.EditorBrowsableAttribute;
using EditorBrowsableState      = System.ComponentModel.EditorBrowsableState;
using AtomicNet;

namespace AtomicNet
{

    public
    abstract    class   LanguageObject<tLanguageObject>
                where   tLanguageObject : LanguageObject<tLanguageObject>
    {

        [EditorBrowsable(EditorBrowsableState.Never)]
        public
        new
        static      bool    Equals(object objA, object objB){return object.Equals(objA, objB);}

        [EditorBrowsable(EditorBrowsableState.Never)]
        public
        override    bool    Equals(object obj) { return base.Equals(obj); }

        [EditorBrowsable(EditorBrowsableState.Never)]
        public
        override    int     GetHashCode(){return base.GetHashCode();}

        [EditorBrowsable(EditorBrowsableState.Never)]
        public
        new         Type    GetType(){return base.GetType();}

        [EditorBrowsable(EditorBrowsableState.Never)]
        protected
        new         object  MemberwiseClone(){return base.MemberwiseClone();}

        [EditorBrowsable(EditorBrowsableState.Never)]
        public
        new
        static      bool    ReferenceEquals(object objA, object objB){return System.Object.ReferenceEquals(objA, objB);}

        [EditorBrowsable(EditorBrowsableState.Never)]
        public
        override    string  ToString(){return base.ToString();}

    }

}
