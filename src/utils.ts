import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
 
export function cn(...args: ClassValue[]) {
  return twMerge(clsx(args));
}

export const getRedirectURL = (path: string) => {
  return `${window.location.origin}${path}`;
};

export const withResolvers = <T>(): {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: unknown) => void;
} => {
  let resolve;
  let reject;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return {
    promise,
    resolve: resolve ?? (() => {}),
    reject: reject ?? (() => {}),
  };
};

export const popUpWasBlocked = (popUp: Window | null): popUp is null =>
  !popUp || popUp.closed || typeof popUp.closed === 'undefined';