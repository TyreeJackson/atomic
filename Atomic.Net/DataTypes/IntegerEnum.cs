namespace AtomicNet
{

    public  class   IntegerEnum<tIntegerEnum>   : SubclassableEnum<tIntegerEnum, int>
            where   tIntegerEnum                : IntegerEnum<tIntegerEnum>
    {

        protected   IntegerEnum(int naturalValue) : base(naturalValue) {}

    }

}
