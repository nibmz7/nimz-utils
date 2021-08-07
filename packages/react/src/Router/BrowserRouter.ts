import createListenerCollection from './Listener';

type unsubscribe = () => void;

export interface RouteMatchResult {
  match: boolean;
  params: { [paramId: string]: string };
}

export interface Router {
  subscribe: (callback: () => void) => unsubscribe;
  go: (pathname: string) => void;
  replace: (pathname: string) => void;
  matchRoute: (pathname: string) => RouteMatchResult;
}
export default class BrowserRouter implements Router {
  previousPathname?: string;

  currentMatches: { [pathname: string]: RouteMatchResult } = {};

  currentParts: string[] = [];

  listeners = createListenerCollection();

  constructor() {
    this.handleUrlChange();
    window.addEventListener('popstate', () => {
      this.previousPathname = undefined;
      this.handleUrlChange();
    });
  }

  go = (path: string): void => {
    if (this.previousPathname && this.previousPathname === path) {
      window.history.back();
      this.previousPathname = undefined;
    } else {
      this.previousPathname = window.location.pathname;
      window.history.pushState({}, '', path);
      this.handleUrlChange();
    }
  };

  replace = (path: string): void => {
    window.history.replaceState({}, '', path);
    this.handleUrlChange();
  };

  subscribe = (callback: () => void): unsubscribe => {
    return this.listeners.subscribe(callback);
  };

  matchRoute = (pathname: string): RouteMatchResult => {
    if (pathname in this.currentMatches) return this.currentMatches[pathname];

    const result: RouteMatchResult = {
      match: false,
      params: {},
    };
    const expectedParts = pathname.split('/');

    const lastExpectedPartIndex = expectedParts.length - 1;
    const lastCurrentPartIndex = this.currentParts.length - 1;

    for (const [index, currentPart] of this.currentParts.entries()) {
      const expectedPart = expectedParts[index];
      const nextExpectedPart = expectedParts[index + 1];

      if (expectedPart == null) break;

      if (expectedPart.startsWith(':')) {
        const paramName = expectedPart.slice(1);
        result.params[paramName] = currentPart;
      } else if (expectedPart !== currentPart) {
        break;
      }

      if (nextExpectedPart === '*') {
        result.match = true;
        break;
      }

      if (index === lastExpectedPartIndex && index === lastCurrentPartIndex) {
        result.match = true;
      }
    }
    this.currentMatches[pathname] = result;

    return result;
  };

  private handleUrlChange = () => {
    const pathname = window.location.pathname;
    this.currentParts = pathname.split('/');
    this.currentMatches = {};
    this.listeners.notify();
  };
}
