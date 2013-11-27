﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AtomicNet
{

    public
    abstract    class   HostApplication : Atom<HostApplication>
    {

        public
        abstract    HostContext         Context     { get; }

        public
        abstract    HostRequest         Request     { get; }

        public
        abstract    HostResponse        Response    { get; }

        public
        abstract    HostServerUtility   Server      { get; }

        public
        abstract    HostPrincipal       User        { get; }

    }

}