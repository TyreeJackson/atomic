using System;

namespace AtomicNet
{

    public  struct  undefined
    {
        public
        static
        readonly    undefined   value;

        public                  undefined() {}

        public
        static      bool    operator ==(undefined undefined1, undefined undefined2)  { return true; }

        public
        static      bool    operator !=(undefined undefined1, undefined undefined2)  { return false; }

    }

    public  struct  Undefinable<T>
    {

        private     bool    isDefined;
        public      bool    IsDefined   { get { return this.isDefined; } }
        private     T       value;
        public      T       Value       { get { if (!this.isDefined) throw new UndefinedException(); return value; } }

        public              Undefinable()
        {
            this.isDefined  = false;
            this.value      = default(T);
        }

        private             Undefinable(T value)
        {
            this.value      = value;
            this.isDefined  = true;
        }

        public      T       GetValueOr(Func<T> defaultValue)                            { return this.isDefined ? this.value : defaultValue(); }

        public
        static
        implicit            operator Undefinable<T>(undefined undefined)                { return new Undefinable<T>(); }

        public
        static
        implicit            operator Undefinable<T>(T value)                            { return new Undefinable<T>(value); }

        public
        static
        implicit            operator T(Undefinable<T> wrapper)                          { if (!wrapper.isDefined) throw new UndefinedException(); return wrapper.value; }

        public
        static      bool    operator ==(Undefinable<T> value1, Undefinable<T> value2)
        {
            return
            (
                !value1.isDefined 
                && 
                !value2.isDefined
            )
            ||
            (
                value1.isDefined
                &&
                value2.isDefined
                &&
                (
                    (
                        value1.value == null
                        &&
                        value2.value == null
                    )
                    ||
                    (
                        value1.value != null
                        &&
                        value2.value != null
                        &&
                        value1.value.Equals(value2.value)
                    )
                )
            );
        }

        public
        static      bool    operator !=(Undefinable<T> value1, Undefinable<T> value2)   { return !(value1 == value2); }

        public
        static      bool    operator ==(Undefinable<T> value, undefined undefined)  { return !value.isDefined; }

        public
        static      bool    operator !=(Undefinable<T> value, undefined undefined)  { return value.isDefined; }

        public
        static      bool    operator ==(undefined undefined, Undefinable<T> value)  { return !value.isDefined; }

        public
        static      bool    operator !=(undefined undefined, Undefinable<T> value)  { return value.isDefined; }

        public
        override    bool    Equals(object obj)
        {
            if (obj == null)
            {
                return this.isDefined && this.value == null;
            }
            else
            {
                var argumentType = obj.GetType();
                if (argumentType == typeof(undefined))              return !this.isDefined;
                if (argumentType == typeof(T) && this.isDefined)    return obj.Equals(this.value);
                if (argumentType == typeof(Undefinable<T>))         return (Undefinable<T>) obj == this;
            }
            return false;
        }

        public
        override    int     GetHashCode()
        {
            if (!this.isDefined)    throw new UndefinedException();
            return  this.value == null ? 0 : this.value.GetHashCode();
        }

        public
        override    string  ToString()
        {
            return  !this.isDefined
                    ?   undefined.value.ToString()
                    :   this.value == null
                        ?   "null"
                        :   this.value.ToString();
        }

    }

}
