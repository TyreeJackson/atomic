using System;
using System.Collections.Generic;
using AtomicNet;

namespace AtomicNet
{

    public  class   Promise : Atom<Promise, Action<Action, Action<Exception>>>
    {

        private     object                      resolveLock         = new object();
        private     bool                        isResolved          = false;
        private     Exception                   rejection           = null;
        private     Stack<Action>               completedListeners  = new Stack<Action>();
        private     Stack<Action<Exception>>    failureListeners    = new Stack<Action<Exception>>();

        public
        static
        readonly    Promise                     NoOp                = new Promise((resolve, reject)=>resolve());

        protected                               Promise(Action<Action, Action<Exception>> action) : base(action)
        {
            Throw<ArgumentNullException>.If(action == null, "action");
            action(this.resolve, this.reject);
        }

        public      Promise                     Then(Func<Promise> onComplete, Action<Exception> onFailure)
        {
            Throw<ArgumentNullException>.If(onComplete==null, "onComplete");
            if (!this.isResolved)
                lock(this.resolveLock)
                    if (!this.isResolved)   return this.registerCallbacks(onComplete, onFailure);
                    else                    return this.notifyCallback(onComplete, onFailure);
            else    return this.notifyCallback(onComplete, onFailure);
        }

        public      Promise<at>                 Then<at>(Func<Promise<at>> onComplete, Action<Exception> onFailure)
        {
            Throw<ArgumentNullException>.If(onComplete==null, "onComplete");
            if (!this.isResolved)
                lock(this.resolveLock)
                    if (!this.isResolved)   return this.registerCallbacks(onComplete, onFailure);
                    else                    return this.notifyCallback(onComplete, onFailure);
            else    return this.notifyCallback(onComplete, onFailure);
        }

        public      void                        WhenDone(Action onComplete, Action<Exception> onFailure)
        {
            Throw<ArgumentNullException>.If(onComplete==null, "onComplete");
            if (!this.isResolved)
                lock(this.resolveLock)
                    if (!this.isResolved)   this.registerCallbacks(onComplete, onFailure);
                    else                    this.notifyCallback(onComplete, onFailure);
            else    this.notifyCallback(onComplete, onFailure);
        }

        private     Promise                     notifyCallback(Func<Promise> onComplete, Action<Exception> onFailure)
        {
            return Atomic.Promise
            ((resolve, reject)=>
            {
                if (this.rejection == null) onComplete().WhenDone(resolve, onFailure);
                else if (onFailure != null) onFailure(this.rejection);
                else                        throw   this.rejection;
            });
        }

        private     Promise<at>                 notifyCallback<at>(Func<Promise<at>> onComplete, Action<Exception> onFailure)
        {
            return Atomic.Promise<at>
            ((resolve, reject)=>
            {
                if (this.rejection == null) onComplete().WhenDone(resolve, onFailure);
                else if (onFailure != null) onFailure(this.rejection);
                else                        throw   this.rejection;
            });
        }

        private     void                        notifyCallback(Action onComplete, Action<Exception> onFailure)
        {
            if (this.rejection == null) onComplete();
            else if (onFailure != null) onFailure(this.rejection);
            else                        throw this.rejection;
        }

        private     void                        registerCallbacks(Action onComplete, Action<Exception> onFailure)
        {
            lock(this.resolveLock)
            {
                this.completedListeners.Push(()=>onComplete());
                this.failureListeners.Push(onFailure);
            }
        }

        private     Promise                     registerCallbacks(Func<Promise> onComplete, Action<Exception> onFailure)
        {
            return Atomic.Promise
            ((resolve, reject)=>
            {
                lock(this.resolveLock)
                {
                    this.completedListeners.Push(()=>onComplete().WhenDone(resolve, onFailure));
                    this.failureListeners.Push(onFailure);
                }
            });
        }

        private     Promise<at>                 registerCallbacks<at>(Func<Promise<at>> onComplete, Action<Exception> onFailure)
        {
            return Atomic.Promise<at>
            ((resolve, reject)=>
            {
                lock(this.resolveLock)
                {
                    this.completedListeners.Push(()=>onComplete().WhenDone(resolve, onFailure));
                    this.failureListeners.Push(onFailure);
                }
            });
        }

        private     void                        resolve()
        {
            lock (this.resolveLock)
            {
                this.isResolved = true;
                while (this.completedListeners.Count > 0)   this.completedListeners.Pop()();
            }
        }

        private     void                        reject(Exception ex)
        {
            lock (this.resolveLock)
            {
                this.rejection  = ex;
                this.isResolved = true;
                while (this.failureListeners.Count > 0) this.failureListeners.Pop()(this.rejection);
            }
        }

    }

}
