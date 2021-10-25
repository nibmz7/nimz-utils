import { createSingleEvent, Unsubscribe } from '@nimz-utils/event-subscriber';

import Observer from './Observer';
import { LifecycleOwner, Lifecycle, State } from 'src/lifecycle/LifecycleOwner';

export default class LiveData<T> {
  private activeListeners = 0;
  private _value: T | undefined;
  private event = createSingleEvent<T>();

  constructor(initalValue?: T) {
    this._value = initalValue;
  }

  protected getValue() {
    return this._value;
  }

  protected setValue(newValue: T) {
    const hasChanged = this._value !== newValue;
    this._value = newValue;
    // @ts-expect-error
    if (hasChanged) this.event.notifyAll(newValue);
  }

  observe(owner: LifecycleOwner, observer: Observer<T>) {
    let _unsubscribe: Unsubscribe;
    let _unsubscribeOwner: Unsubscribe | undefined;
    let ownerState: State;
    this.activeListeners++;
    const innerUnsubscribe = () => {
      _unsubscribe();
      _unsubscribeOwner?.();
      this.activeListeners--;
      if (this.activeListeners === 0) this.onInactive();
    };
    const innerObserver = () => {
      if (ownerState === Lifecycle.State.STARTED) {
        observer(this._value as T, innerUnsubscribe);
      }
    };
    _unsubscribe = this.event.subscribe(innerObserver);
    _unsubscribeOwner = owner.observe((_state, unsubscribeOwner) => {
      ownerState = _state;
      switch (ownerState) {
        case Lifecycle.State.STARTED: {
          if (this._value) innerObserver();
          break;
        }
        case Lifecycle.State.PAUSED: {
          break;
        }
        case Lifecycle.State.DESTROYED: {
          unsubscribeOwner();
          innerUnsubscribe();
          break;
        }
        default: {
          throw 'Invalid lifecycle state';
        }
      }
    });
    if (this.activeListeners === 1) this.onActive();
    return innerUnsubscribe;
  }

  observeForever(observer: Observer<T>): Unsubscribe {
    let _unsubscribe: Unsubscribe;
    this.activeListeners++;
    const innerUnsubscribe = () => {
      _unsubscribe();
      this.activeListeners--;
      if (this.activeListeners === 0) this.onInactive();
    };
    const innerObserver = (t: T) => {
      observer(t, innerUnsubscribe);
    };
    _unsubscribe = this.event.subscribe(innerObserver);
    if (this.activeListeners === 1) this.onActive();
    if (this._value) observer(this._value, innerUnsubscribe);
    return innerUnsubscribe;
  }

  protected onActive() {}

  protected onInactive() {}
}
