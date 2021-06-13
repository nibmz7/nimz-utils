export type RefCallback = (element: HTMLElement | null) => void;

export type ChildWithRef = JSX.Element & {
  ref?: RefCallback;
};