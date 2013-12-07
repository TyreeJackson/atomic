using AtomicNet;

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
                    >                       allValues       = new Dictionary<tNaturalType,tSubclassableEnum>();

        private
        readonly    tNaturalType            naturalValue;

        protected   SubclassableEnum(tNaturalType naturalValue)
        {
            this.naturalValue = naturalValue;
        }

    }

}
