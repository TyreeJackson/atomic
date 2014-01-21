using System;
using System.Collections.Generic;
using AtomicNet;

namespace AtomicNet
{

    public  class   Promise<t> : Atom<Promise<t>, Action<Action<t>, Action<Exception>>>
    {

        private     t                           value;
        private     object                      resolveLock         = new object();
        private     bool                        isResolved          = false;
        private     Exception                   rejection           = null;
        private     Stack<Action>               completedListeners  = new Stack<Action>();
        private     Stack<Action<Exception>>    failureListeners    = new Stack<Action<Exception>>();

        protected                               Promise(t value) : base(null)
        {
            this.resolve(value);
        }

        public
        static
        implicit
        operator                                Promise<t>(t value) { return new Promise<t>(value); }

        public                                  Promise(Action<Action<t>, Action<Exception>> action) : base(action)
        {
            Throw<ArgumentNullException>.If(action == null, "action");
            try                 { action(this.resolve, this.reject); }
            catch(Exception ex) { this.reject(ex); }
        }

        public      Promise                     Then(Func<t, Promise> onComplete, Action<Exception> onFailure)
        {
            Throw<ArgumentNullException>.If(onComplete==null, "onComplete");
            if (!this.isResolved)
                lock(this.resolveLock)
                    if (!this.isResolved)   return this.registerCallbacks(onComplete, onFailure);
                    else                    return this.notifyCallback(onComplete, onFailure);
            else    return this.notifyCallback(onComplete, onFailure);
        }

        public      Promise<at>                 RelayTo<at>(Func<t, Promise<at>> onComplete, Action<Exception> onFailure)
        {
            Throw<ArgumentNullException>.If(onComplete==null, "onComplete");
            if (!this.isResolved)
                lock(this.resolveLock)
                    if (!this.isResolved)   return this.registerCallbacks(onComplete, onFailure);
                    else                    return this.notifyCallback(onComplete, onFailure);
            else    return this.notifyCallback(onComplete, onFailure);
        }

        public      void                        WhenDone(Action<t> onComplete, Action<Exception> onFailure)
        {
            Throw<ArgumentNullException>.If(onComplete==null, "onComplete");
            if (!this.isResolved)
                lock(this.resolveLock)
                    if (!this.isResolved)   this.registerCallbacks(onComplete, onFailure);
                    else                    this.notifyCallback(onComplete, onFailure);
            else    this.notifyCallback(onComplete, onFailure);
        }

        private     Promise                     notifyCallback(Func<t, Promise> onComplete, Action<Exception> onFailure)
        {
            return Atomic.Promise
            ((resolve, reject)=>
            {
                if (onComplete !=null && this.rejection == null)    onComplete(this.value).WhenDone(resolve, onFailure);
                else if (onFailure != null)                         onFailure(this.rejection);
                else                                                throw   this.rejection;
            });
        }

        private     Promise<at>                 notifyCallback<at>(Func<t, Promise<at>> onComplete, Action<Exception> onFailure)
        {
            return Atomic.Promise<at>
            ((resolve, reject)=>
            {
                if (onComplete !=null && this.rejection == null)    onComplete(this.value).WhenDone(resolve, onFailure);
                else if (onFailure != null)                         onFailure(this.rejection);
                else                                                throw   this.rejection;
            });
        }

        private     void                        notifyCallback(Action<t> onComplete, Action<Exception> onFailure)
        {
            if (onComplete !=null && this.rejection == null)    onComplete(this.value);
            else if (onFailure != null)                         onFailure(this.rejection);
            else                                                throw this.rejection;
        }

        private     void                        registerCallbacks(Action<t> onComplete, Action<Exception> onFailure)
        {
            lock(this.resolveLock)
            {
                this.completedListeners.Push(()=>onComplete(this.value));
                this.failureListeners.Push(onFailure);
            }
        }

        private     Promise                     registerCallbacks(Func<t, Promise> onComplete, Action<Exception> onFailure)
        {
            return Atomic.Promise
            ((resolve, reject)=>
            {
                lock(this.resolveLock)
                {
                    this.completedListeners.Push(()=>onComplete(this.value).WhenDone(resolve, onFailure));
                    this.failureListeners.Push(onFailure);
                }
            });
        }

        private     Promise<at>                 registerCallbacks<at>(Func<t, Promise<at>> onComplete, Action<Exception> onFailure)
        {
            return Atomic.Promise<at>
            ((resolve, reject)=>
            {
                lock(this.resolveLock)
                {
                    this.completedListeners.Push(()=>onComplete(this.value).WhenDone(resolve, onFailure));
                    this.failureListeners.Push(onFailure);
                }
            });
        }

        private     void                        resolve(t value)
        {
            lock (this.resolveLock)
            {
                this.value      = value;
                this.isResolved = true;
                while (this.completedListeners.Count > 0)   this.completedListeners.Pop()();
            }
        }

        private     void                        reject(Exception ex)
        {
            lock (this.resolveLock)
            {
                if (!(ex is PromiseException))
                try
                {
                    if (ex.StackTrace != null)  this.rejection  = new PromiseException(ex);
                    else                        throw ex;
                }
                catch(Exception ex2)
                {
                    this.rejection  = new PromiseException(ex2);
                }
                else                            this.rejection  = ex;
                this.isResolved = true;
                while (this.failureListeners.Count > 0) this.failureListeners.Pop()(this.rejection);
            }
        }

    }

}
