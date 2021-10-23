import LiveData from "./LiveData";

export default class MutableLiveData<T> extends LiveData<T> {
  get value() {
    return this.getValue() as T;
  }

  set value(newValue: T) {
    this.setValue(newValue);
  }
}
