using AtomicNet;

namespace AtomicNet
{

    public
    class   StringIntegerEnum<tStringIntegerEnum>   : IntegerEnum<tStringIntegerEnum>
    where   tStringIntegerEnum                      : StringIntegerEnum<tStringIntegerEnum>
    {

        private
        static
        readonly    Dictionary
                    <
                        string,
                        tStringIntegerEnum
                    >                       allValuesByStringValue  = new Dictionary<string, tStringIntegerEnum>();

        private
        readonly    string                  secondaryNaturalValue;

        protected   StringIntegerEnum(int naturalValue, string secondaryNaturalValue) : base(naturalValue)
        {
            Throw<System.ArgumentException>.If(allValuesByStringValue.ContainsKey(secondaryNaturalValue), "A duplicate secondary natural value was specified for the " + TypeSupport<tStringIntegerEnum>.Name + " enumerated context.");

            allValuesByStringValue.Add(secondaryNaturalValue, (tStringIntegerEnum) this);
            this.secondaryNaturalValue  = secondaryNaturalValue;
        }

    }

}
