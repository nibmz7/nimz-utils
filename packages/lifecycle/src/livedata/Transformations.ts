import LiveData from './LiveData';
import MediatorLiveData from './MediatorLiveData';

export default class Transformations {
  static map<X, Y>(source: LiveData<X>, func: (x: X) => Y) {
    const result = new MediatorLiveData<Y>();
    result.addSource(source, (x: X) => {
      result.value = func(x);
    });
    return result;
  }

  static switchMap<X, Y>(trigger: LiveData<X>, func: (x: X) => LiveData<Y>) {
    const result = new MediatorLiveData<Y>();
    let source: LiveData<Y>;
    result.addSource(trigger, (x: X) => {
      const newLiveData = func(x);
      if (source === newLiveData) return;
      if (source) result.removeSource(source);
      source = newLiveData;
      if (source) {
        result.addSource(source, (y: Y) => {
          result.value = y;
        });
      }
    });
    return result;
  }
}
