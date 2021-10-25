import LiveData from './LiveData';
import MutableLiveData from './MutableLiveData';
import { Unsubscribe } from '@nimz-utils/event-subscriber';

export default class MediatorLiveData<T> extends MutableLiveData<T> {
  private unsubscribeMap = new Map<Object, Unsubscribe>();

  addSource<S>(source: LiveData<S>, observer: (s: S) => void) {
    const unsubscribe = source.observeForever(observer);
    this.unsubscribeMap.set(source, unsubscribe);
  }

  removeSource<S>(source: LiveData<S>) {
    const unsubscribe = this.unsubscribeMap.get(source);
    if (unsubscribe) {
      unsubscribe();
      this.unsubscribeMap.delete(source);
    }
  }
}
