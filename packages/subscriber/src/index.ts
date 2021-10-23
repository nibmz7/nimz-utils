export type Unsubscribe = () => void;

interface Listener<T> {
  callback: (arg: T, unsubscribe: Unsubscribe) => void;
  next: Listener<T> | null;
  prev: Listener<T> | null;
}

interface SingleEvent<T> {
  subscribe: (
    callback: (arg: T, unsubscribe: Unsubscribe) => void
  ) => Unsubscribe;
  notifyAll: (...arg: T extends undefined ? [] : [T]) => void;
  clearAll: () => void;
}

export const createSingleEvent = <T = undefined>(): SingleEvent<T> => {
  type Callback = Listener<T>['callback'];

  let head: Listener<T> | null = null;
  let tail: Listener<T> | null = null;

  const removeListener = (listener: Listener<T>) => {
    if (listener.next == null && listener.prev == null) return;

    if (listener.prev) {
      listener.prev.next = listener.next;
    } else {
      head = listener.next;
    }

    if (listener.next) {
      listener.next.prev = listener.prev;
    } else {
      tail = listener.prev;
    }

    listener.next = null;
    listener.prev = null;
  };

  const notifyAll = (...[arg]: T extends undefined ? [] : [T]) => {
    let listener = head;
    let shouldRemoveListener = false;
    const unsubscribe = () => {
      shouldRemoveListener = true;
    };
    while (listener) {
      const nextListener = listener.next;
      listener.callback(arg as T, unsubscribe);
      if (shouldRemoveListener) removeListener(listener);
      listener = nextListener;
      shouldRemoveListener = false;
    }
  };

  const subscribe = (callback: Callback): Unsubscribe => {
    let listener: Listener<T> = {
      callback,
      next: null,
      prev: tail,
    };

    tail = listener;

    if (listener.prev) {
      listener.prev.next = listener;
    } else {
      head = listener;
    }

    const unsubscribe = () => {
      removeListener(listener);
    };

    return unsubscribe;
  };

  const clearAll = () => {
    head = null;
    tail = null;
  };

  const hasListeners = () => head != null;

  return {
    subscribe,
    notifyAll,
    clearAll,
  };
};

type EventEntities = Record<string, unknown>;

export const createMultipleEvents = <T extends EventEntities>() => {
  type Callback<S extends keyof T> = Listener<T[S]>['callback'];
  type EventsObj = { [K in keyof T]: SingleEvent<T[K]> };

  const events = {} as EventsObj;

  const subscribe = <K extends keyof T>(name: K, callback: Callback<K>) => {
    if (!(name in events)) events[name] = createSingleEvent();
    events[name].subscribe(callback);
  };

  const notifyAll = <K extends keyof T>(
    ...[name, arg]: T[K] extends undefined ? [K] : [K, T[K]]
  ) => {
    //@ts-ignore
    if (name in events) events[name].notifyAll(arg);
  };

  const clearAll = (name: keyof T) => {
    if (name in events) events[name].clearAll();
  };

  return {
    subscribe,
    notifyAll,
    clearAll,
  };
};
