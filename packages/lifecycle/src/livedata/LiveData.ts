import { createSingleEvent, Unsubscribe } from '@nimz-utils/event-subscriber';

import Observer from './Observer';

export default class LiveData<T> {
  private activeListeners = 0;
  private _value: T | undefined;
  private event = createSingleEvent<T>();
  private triggerOnActiveId: ReturnType<typeof setTimeout> | undefined;
  private triggerOnInactiveId: ReturnType<typeof setTimeout> | undefined;

  protected getValue() {
    return this._value;
  }

  protected setValue(newValue: T) {
    const hasChanged = this._value !== newValue;
    this._value = newValue;
    // @ts-expect-error
    if (hasChanged) this.event.notifyAll(newValue);
  }

  private triggerOnActive() {
    if (this.triggerOnInactiveId !== undefined) {
      clearTimeout(this.triggerOnInactiveId);
      this.triggerOnInactiveId = undefined;
    }
    this.triggerOnActiveId = setTimeout(() => {
      this.onActive();
    });
  }

  private triggerOnInactive() {
    if (this.triggerOnActiveId !== undefined) {
      clearTimeout(this.triggerOnActiveId);
      this.triggerOnActiveId = undefined;
    }
    this.triggerOnInactiveId = setTimeout(() => {
      this.onInactive();
    });
  }

  observe(observer: Observer<T>): Unsubscribe {
    let _unsubscribe: Unsubscribe;
    this.activeListeners++;
    const innerUnsubscribe = () => {
      _unsubscribe();
      this.activeListeners--;
      if (this.activeListeners === 0) this.triggerOnInactive();
    };
    const innerObserver: Observer<T> = (t) => {
      observer(t, innerUnsubscribe);
    };
    _unsubscribe = this.event.subscribe(innerObserver);
    if (this.activeListeners === 1) this.triggerOnActive();
    return innerUnsubscribe;
  }

  protected onActive() {}

  protected onInactive() {}
}
