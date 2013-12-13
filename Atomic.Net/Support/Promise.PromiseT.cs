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
            if (!this.isResolved)
                lock(this.resolveLock)
                    if (!this.isResolved)   return this.registerCallbacks(onComplete, onFailure);
                    else                    return this.notifyCallback(onComplete, onFailure);
            else    return this.notifyCallback(onComplete, onFailure);
        }

        public      Promise<at>                 Then<at>(Func<t, Promise<at>> onComplete, Action<Exception> onFailure)
        {
            if (!this.isResolved)
                lock(this.resolveLock)
                    if (!this.isResolved)   return this.registerCallbacks(onComplete, onFailure);
                    else                    return this.notifyCallback(onComplete, onFailure);
            else    return this.notifyCallback(onComplete, onFailure);
        }

        public      void                        WhenDone(Action<t> onComplete, Action<Exception> onFailure)
        {
            if (!this.isResolved)
                lock(this.resolveLock)
                    if (!this.isResolved)   this.registerCallbacks(onComplete, onFailure);
                    else                    this.notifyCallback(onComplete, onFailure);
            else    this.notifyCallback(onComplete, onFailure);
        }

        private     Promise                     notifyCallback(Func<t, Promise> onComplete, Action<Exception> onFailure)
        {
            if (onComplete !=null && this.rejection == null)    return onComplete(this.value);
            else if (onFailure != null)                         onFailure(this.rejection);
            return  Atomic.Promise((resolve, reject)=>resolve());
        }

        private     Promise<at>                 notifyCallback<at>(Func<t, Promise<at>> onComplete, Action<Exception> onFailure)
        {
            if (onComplete !=null && this.rejection == null)    return onComplete(this.value);
            else if (onFailure != null)                         onFailure(this.rejection);
            return  Atomic.Promise<at>((resolve, reject)=>resolve(default(at)));
        }

        private     void                        notifyCallback(Action<t> onComplete, Action<Exception> onFailure)
        {
            if (onComplete !=null && this.rejection == null)    onComplete(this.value);
            else if (onFailure != null)                         onFailure(this.rejection);
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
            this.value      = value;
            this.isResolved = true;
        }

        private     void                        reject(Exception ex)
        {
            this.rejection  = ex;
            this.isResolved = true;
        }

    }

}
