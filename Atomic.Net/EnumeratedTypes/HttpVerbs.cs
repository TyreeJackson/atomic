namespace AtomicNet
{

    public  class   HttpVerbs : StringEnum<HttpVerbs>
    {

        public  static  readonly    HttpVerbs   Activate    = new HttpVerbs("ACTIVATE");
        public  static  readonly    HttpVerbs   Deactivate  = new HttpVerbs("DEACTIVATE");
        public  static  readonly    HttpVerbs   Delette     = new HttpVerbs("DELETE");
        public  static  readonly    HttpVerbs   Get         = new HttpVerbs("GET");
        public  static  readonly    HttpVerbs   Head        = new HttpVerbs("HEAD");
        public  static  readonly    HttpVerbs   Options     = new HttpVerbs("OPTIONS");
        public  static  readonly    HttpVerbs   Patch       = new HttpVerbs("PATCH");
        public  static  readonly    HttpVerbs   Post        = new HttpVerbs("POST");
        public  static  readonly    HttpVerbs   Put         = new HttpVerbs("PUT");
        public  static  readonly    HttpVerbs   Status      = new HttpVerbs("STATUS");

        protected                               HttpVerbs(string verb) : base(verb) {}
    
    }

}
