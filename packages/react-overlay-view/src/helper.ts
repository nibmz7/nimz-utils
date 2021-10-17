/* eslint-disable no-param-reassign */
export type OverlayViewPosition = 'top' | 'bottom' | 'left' | 'right';
export type OverlayViewAlignment = 'start' | 'center' | 'end';
export interface Coordinate {
  x: number;
  y: number;
}

const WINDOW_PADDING = 24;

export const positionElementByReference = (
  element: HTMLElement,
  referenceElement: HTMLElement,
  position: OverlayViewPosition,
  alignment: OverlayViewAlignment
): void => {
  element.style.position = 'absolute';

  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;
  const referenceCoordinates = referenceElement.getBoundingClientRect();
  const referenceWidth = referenceElement.offsetWidth;
  const referenceHeight = referenceElement.offsetHeight;
  const elementHeight = element.offsetHeight;
  const elementWidth = element.offsetWidth;

  let { top, left } = element.getBoundingClientRect();

  switch (position) {
    case 'left': {
      top = referenceCoordinates.top;
      left = referenceCoordinates.left - elementWidth;
      break;
    }

    case 'right': {
      top = referenceCoordinates.top;
      left = referenceCoordinates.right;
      break;
    }

    case 'top': {
      top = referenceCoordinates.top - elementHeight;
      left = referenceCoordinates.left;
      break;
    }

    case 'bottom': {
      top = referenceCoordinates.bottom;
      left = referenceCoordinates.left;
      break;
    }

    default:
      break;
  }

  if (alignment === 'center') {
    if (position === 'left' || position === 'right') {
      top -= elementHeight / 2 - referenceHeight / 2;
    } else if (position === 'top' || position === 'bottom') {
      left += referenceWidth / 2 - elementWidth / 2;
    }
  } else if (alignment === 'end') {
    if (position === 'left' || position === 'right') {
      top -= elementHeight - referenceHeight;
    } else if (position === 'top' || position === 'bottom') {
      left += referenceWidth - elementWidth;
    }
  }

  const right = left + elementWidth;
  const bottom = top + elementHeight;

  if (left < 0) {
    left = WINDOW_PADDING;
  } else if (right > windowWidth) {
    left = windowWidth - elementWidth - WINDOW_PADDING;
  }

  if (top < 0) {
    top = WINDOW_PADDING;
  } else if (bottom > windowHeight) {
    top = windowHeight - elementHeight - WINDOW_PADDING;
  }

  element.style.top = `${top}px`;
  element.style.left = `${left}px`;
};

export const positionElementByCoordinate = (
  element: HTMLElement,
  referenceCoordinate: Coordinate,
  position: OverlayViewPosition,
  alignment: OverlayViewAlignment
): void => {
  element.style.position = 'absolute';

  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;
  const elementHeight = element.offsetHeight;
  const elementWidth = element.offsetWidth;

  let { y: top, x: left } = referenceCoordinate;

  switch (position) {
    case 'left': {
      left -= elementWidth;
      break;
    }

    case 'right': {
      break;
    }

    case 'top': {
      top -= elementHeight;
      break;
    }

    case 'bottom': {
      break;
    }

    default:
      break;
  }

  if (alignment === 'center') {
    if (position === 'left' || position === 'right') {
      top -= elementHeight / 2;
    } else if (position === 'top' || position === 'bottom') {
      left -= elementWidth / 2;
    }
  } else if (alignment === 'start') {
    if (position === 'left' || position === 'right') {
      top -= elementHeight;
    } else if (position === 'top' || position === 'bottom') {
      left -= elementWidth;
    }
  }

  const right = left + elementWidth;
  const bottom = top + elementHeight;

  if (left < 0) {
    left = WINDOW_PADDING;
  } else if (right > windowWidth) {
    left = windowWidth - elementWidth - WINDOW_PADDING;
  }

  if (top < 0) {
    top = WINDOW_PADDING;
  } else if (bottom > windowHeight) {
    top = windowHeight - elementHeight - WINDOW_PADDING;
  }

  element.style.position = 'absolute';
  element.style.top = `${top}px`;
  element.style.left = `${left}px`;
};
