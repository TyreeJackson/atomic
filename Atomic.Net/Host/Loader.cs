namespace AtomicNet
{

    public  abstract    class   Loader
    {

        internal
        static      bool    IsPreloading            { get; private set; }

        protected   void    Boot(bool preloading)
        {
            Loader.IsPreloading = preloading;
            Atomic.Boot();
        }

    }

}
