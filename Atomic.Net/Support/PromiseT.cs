using System;
using System.Collections.Generic;
using AtomicNet;

namespace AtomicNet
{

    public  class   Promise<t> : Atom<Promise<t>>
    {

        private     t                           value;
        private     object                      resolveLock         = new object();
        private     bool                        isResolved          = false;
        private     Exception                   rejection           = null;
        private     Stack<Action>               completedListeners  = new Stack<Action>();
        private     Stack<Action<Exception>>    failureListeners    = new Stack<Action<Exception>>();

        protected                               Promise(t value)
        {
            this.resolve(value);
        }

        public  static  implicit    operator    Promise<t>(t value) { return new Promise<t>(value); }

        protected                               Promise(Action<Action<t>, Action<Exception>> action)
        {
            Throw<ArgumentNullException>.If(action == null, "action");
            action(this.resolve, this.reject);
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

        public      Promise<at1, at2>           Then<at1, at2>(Func<t, Promise<at1, at2>> onComplete, Action<Exception> onFailure)
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

        private     Promise<at1, at2>           notifyCallback<at1, at2>(Func<t, Promise<at1, at2>> onComplete, Action<Exception> onFailure)
        {
            if (onComplete !=null && this.rejection == null)    return onComplete(this.value);
            else if (onFailure != null)                         onFailure(this.rejection);
            return  Atomic.Promise<at1, at2>((resolve, reject)=>resolve(default(at1), default(at2)));
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

        private     Promise<at1, at2>           registerCallbacks<at1, at2>(Func<t, Promise<at1, at2>> onComplete, Action<Exception> onFailure)
        {
            return Atomic.Promise<at1, at2>
            ((resolve, reject)=>
            {
                lock(this.resolveLock)
                {
                    this.completedListeners.Push(()=>onComplete(this.value).Done(resolve, onFailure));
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

    #warning Do we think we might need a two parameter promise?  If so, here is the start of one
    public  class   Promise<t1, t2> : Atom<Promise<t1, t2>>
    {

        public      Promise     Then(Func<t1, t2, Promise> onComplete, Action<Exception> onFailure)
        {
            throw new NotImplementedException();
        }

        public      Promise<t2> Then<at>(Func<t1, t2, Promise<at>> onComplete, Action<Exception> onFailure)
        {
            throw new NotImplementedException();
        }

        public      Promise<t2> Then<at1, at2>(Func<t1, t2, Promise<at1, at2>> onComplete, Action<Exception> onFailure)
        {
            throw new NotImplementedException();
        }

        public      void        Done(Action<t1, t2> onComplete, Action<Exception> onFailure)
        {
            throw new NotImplementedException();
        }

    }

}
