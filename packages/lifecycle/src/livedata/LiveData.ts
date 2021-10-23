import { createSingleEvent, Unsubscribe } from '@nimz-utils/event-subscriber';

import Observer from './Observer';

export default class LiveData<T> {
  private isActive = false;
  private activeListeners = 0;
  private _value: T | undefined;
  private event = createSingleEvent<T>();

  protected getValue() {
    return this._value;
  }

  protected setValue(newValue: T) {
    const hasChanged = this._value !== newValue;
    this._value = newValue;
    // @ts-expect-error
    if (hasChanged) this.event.notifyAll(newValue);
  }

  observe(observer: Observer<T>): Unsubscribe {
    let _unsubscribe: Unsubscribe;
    this.activeListeners++;
    const innerUnsubscribe = () => {
      _unsubscribe();
      this.activeListeners--;
      if (this.isActive && this.activeListeners === 0) {
        this.isActive = false;
        this.onInactive();
      }
    };
    const innerObserver: Observer<T> = (t) => {
      observer(t, innerUnsubscribe);
    };
    _unsubscribe = this.event.subscribe(innerObserver);
    setTimeout(() => {
      if (!this.isActive && this.activeListeners > 0) {
        this.isActive = true;
        this.onActive();
      }
    });
    return innerUnsubscribe;
  }

  protected onActive() {}

  protected onInactive() {}
}
