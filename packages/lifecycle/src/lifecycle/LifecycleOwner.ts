import { createSingleEvent, Unsubscribe } from '@nimz-utils/event-subscriber';

export enum State {
  STARTED,
  PAUSED,
  DESTROYED,
}

export const Lifecycle = {
  State,
} as const;

type LifecycleObserver = (state: State, unsubscribe: Unsubscribe) => void;

export abstract class LifecycleOwner {
  private state: State;
  private events = createSingleEvent<State>();

  constructor(initialState: State = State.STARTED) {
    this.state = initialState;
  }

  getCurrentState() {
    return this.state;
  }

  notifyStateChanged(newState: State) {
    if (this.state === newState) return;
    this.state = newState;
    this.events.notifyAll(newState);
  }

  observe(observer: LifecycleObserver) {
    const unsubscribe = this.events.subscribe(observer);
    observer(this.state, unsubscribe);
    return unsubscribe;
  }
}
