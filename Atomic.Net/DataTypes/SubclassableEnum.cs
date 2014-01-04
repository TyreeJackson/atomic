using AtomicNet;
using Generic = System.Collections.Generic;

namespace AtomicNet
{

    public
    class   SubclassableEnum<tSubclassableEnum, tNaturalType>
    where   tSubclassableEnum                                   : SubclassableEnum<tSubclassableEnum, tNaturalType>
    {

        private
        static
        readonly    Dictionary
                    <
                        tNaturalType,
                        tSubclassableEnum
                    >                       allValues           = new Dictionary<tNaturalType,tSubclassableEnum>();

        private
        readonly    tNaturalType            naturalValue;

        static      SubclassableEnum()                          { System.Runtime.CompilerServices.RuntimeHelpers.RunClassConstructor(typeof(tSubclassableEnum).TypeHandle); }

        protected   SubclassableEnum(tNaturalType naturalValue)
        {
            Throw<System.ArgumentException>.If(allValues.ContainsKey(naturalValue), "A duplicate natural value was specified for the " + TypeSupport<tSubclassableEnum>.Name + " enumerated context.");

            allValues.Add(naturalValue, (tSubclassableEnum) this);
            this.naturalValue = naturalValue;
        }

        public  static  implicit    operator    tNaturalType(SubclassableEnum<tSubclassableEnum, tNaturalType> value)
        {
            return value != null ? value.naturalValue : default(tNaturalType);
        }

        public  static  tSubclassableEnum               TrySelect(tNaturalType naturalValue, tSubclassableEnum defaultValue)
        {
            return allValues.TryReturnValueAs(naturalValue, defaultValue);
        }                                    

        public  static  Generic.List<tSubclassableEnum> AllValues
        {
            get
            {
                return allValues.Values.ConvertToList(a=>a);
            }
        }

        public  static  Generic.List<tNaturalType>      AllNaturalValues
        {
            get
            {
                return allValues.Values.ConvertToList(a=>a.naturalValue);
            }
        }

    }

}
