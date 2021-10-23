import { Unsubscribe } from '@nimz-utils/event-subscriber';

type Observer<T> = (t: T, unsubscribe: Unsubscribe) => void;

export default Observer;
