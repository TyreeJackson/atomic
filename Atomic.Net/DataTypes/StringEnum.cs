using AtomicNet;

namespace AtomicNet
{

    public
    class   StringEnum<tStringEnum> : SubclassableEnum<tStringEnum, string>
    where   tStringEnum             : StringEnum<tStringEnum>
    {

        protected   StringEnum(string naturalValue) : base(naturalValue) {}

    }

}
