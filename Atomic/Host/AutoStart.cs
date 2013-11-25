namespace AtomicStack
{

    public  abstract    class   AutoStart
    {

        protected   void    Boot(bool preloading)   { Atomic.Boot(preloading); }

    }

}
