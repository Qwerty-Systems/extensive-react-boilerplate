import { Dispatch, useCallback, useMemo, useRef } from "react";

export const useConfirmPromise = <T,>() => {
  const resolveRef = useRef<Dispatch<any>>();
  const rejectRef = useRef<Dispatch<any>>();

  const resolve = useCallback(<Options extends T>(value: Options) => {
    if (resolveRef.current) {
      resolveRef.current(value);
    }
  }, []);

  const reject = useCallback((reason?: any) => {
    if (rejectRef.current) {
      rejectRef.current(reason);
    }
  }, []);

  const promise = useCallback(<Options extends T>() => {
    return new Promise<Options>((resolve, reject) => {
      resolveRef.current = resolve;
      rejectRef.current = reject;
    });
  }, []);

  return useMemo(
    () => ({ promise, resolve, reject }),
    [promise, resolve, reject]
  );
};
