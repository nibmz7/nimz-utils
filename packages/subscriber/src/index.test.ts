import { createSingleEvent, createMultipleEvents } from './index';

describe('Create Single Event', () => {
  const eventone = createSingleEvent<string>();
  const eventTwo = createSingleEvent();

  const listenerOne = jest.fn();
  const listenerTwo = jest.fn();
  const listenerThree = jest.fn();

  test('Listeners called correct number of times & with the correct arguments', () => {
    const unsubOne = eventone.subscribe(listenerOne);

    eventone.notifyAll('hello 1');
    eventone.subscribe(listenerTwo);
    eventone.notifyAll('hello 2');
    unsubOne();
    eventone.subscribe(listenerThree);
    eventone.notifyAll('hello 3');

    expect(listenerOne).toBeCalledTimes(2);
    expect(listenerTwo).toBeCalledTimes(2);
    expect(listenerThree).toBeCalledTimes(1);

    expect(listenerOne.mock.calls).toEqual([
      ['hello 1', expect.anything()],
      ['hello 2', expect.anything()],
    ]);

    expect(listenerTwo.mock.calls).toEqual([
      ['hello 2', expect.anything()],
      ['hello 3', expect.anything()],
    ]);

    expect(listenerThree.mock.calls).toEqual([['hello 3', expect.anything()]]);
  });

  test('Clear all should work', () => {
    eventone.notifyAll('hello 4');

    expect(listenerTwo).toBeCalledTimes(3);
    expect(listenerThree).toBeCalledTimes(2);

    eventone.clearAll();
    eventone.notifyAll('hello 5');

    expect(listenerTwo).toBeCalledTimes(3);
    expect(listenerThree).toBeCalledTimes(2);
  });

  test('Should have NO type errors', () => {
    eventTwo.notifyAll();
  });

  test('Should HAVE type errors', () => {
    // eventone.notifyAll();
    // eventone.notifyAll({});
    // eventone.notifyAll(2);
  });
});

describe('Create Multiple Events', () => {
  type Events = {
    one: undefined;
    two: { param: string };
    three: { param: number };
    four: number;
  };

  const events = createMultipleEvents<Events>();

  const listenerOne = jest.fn();
  const listenerTwo = jest.fn();

  test('Should have NO type errors', () => {
    events.notifyAll('one');
    events.notifyAll('two', { param: 'ddsd' });
    events.notifyAll('three', { param: 2 });
    events.notifyAll('four', 2);
  });

  test('Notify All should work', () => {
    events.subscribe('one', listenerOne);
    events.subscribe('two', listenerTwo);

    events.notifyAll('one');
    events.notifyAll('one');
    events.notifyAll('one');

    expect(listenerOne).toBeCalledTimes(3);
    expect(listenerOne.mock.calls).toEqual([
      [undefined, expect.anything()],
      [undefined, expect.anything()],
      [undefined, expect.anything()],
    ]);

    events.notifyAll('two', { param: 'one' });
    events.notifyAll('two', { param: 'two' });
    events.notifyAll('two', { param: 'three' });

    expect(listenerTwo).toBeCalledTimes(3);
    expect(listenerTwo.mock.calls).toEqual([
      [{ param: 'one' }, expect.anything()],
      [{ param: 'two' }, expect.anything()],
      [{ param: 'three' }, expect.anything()],
    ]);
  });

  test('Clear all listeners should work', () => {
    events.notifyAll('one');
    events.notifyAll('two', { param: 'four' });

    expect(listenerOne).toBeCalledTimes(4);
    expect(listenerTwo).toBeCalledTimes(4);

    events.clearAll('two');
    events.notifyAll('one');
    events.notifyAll('two', { param: 'five' });

    expect(listenerOne).toBeCalledTimes(5);
    expect(listenerTwo).toBeCalledTimes(4);
  });

  test('Should HAVE type errors', () => {
    // events.notifyAll('two');
    // events.notifyAll('one', {});
    // events.notifyAll('two', { param: 2 });
  });
});
