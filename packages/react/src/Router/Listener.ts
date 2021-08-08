// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from 'react-dom';

interface Listener {
  callback: () => void;
  next: Listener | null;
  prev: Listener | null;
}

// Courtesy of react-redux library
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function createListenerCollection() {
  let first: Listener | null = null;
  let last: Listener | null = null;

  return {
    clear() {
      first = null;
      last = null;
    },

    notify() {
      unstable_batchedUpdates(() => {
        let listener = first;
        while (listener) {
          listener.callback();
          listener = listener.next;
        }
      });
    },

    subscribe(callback: () => void) {
      let isSubscribed = true;

      const listener: Listener = {
        callback,
        next: null,
        prev: last,
      };

      last = listener;

      if (listener.prev) {
        listener.prev.next = listener;
      } else {
        first = listener;
      }

      return function unsubscribe() {
        if (!isSubscribed || first === null) return;
        isSubscribed = false;

        if (listener.next) {
          listener.next.prev = listener.prev;
        } else {
          last = listener.prev;
        }
        if (listener.prev) {
          listener.prev.next = listener.next;
        } else {
          first = listener.next;
        }
      };
    },
  };
}
