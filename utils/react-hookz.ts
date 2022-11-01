import { DependencyList, useEffect, useMemo, useRef } from 'react';

/**
 * Like `useRef`, but it returns immutable ref that contains actual value.
 *
 * @param value
 */
export function useSyncedRef<T>(value: T): { readonly current: T } {
    const ref = useRef(value);

    ref.current = value;

    return useMemo(
        () =>
            Object.freeze({
                get current() {
                    return ref.current;
                },
            }),
        [],
    );
}

/**
 * Run effect only when component is unmounted.
 *
 * @param effect Effector to run on unmount
 */
export function useUnmountEffect(effect: CallableFunction): void {
    const effectRef = useSyncedRef(effect);

    useEffect(
        () => () => {
            effectRef.current();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );
}

export interface IDebouncedFunction<Fn extends (...args: any[]) => any> {
    (this: ThisParameterType<Fn>, ...args: Parameters<Fn>): void;
}

/**
 * Makes passed function debounced, otherwise acts like `useCallback`.
 *
 * @param callback Function that will be debounced.
 * @param deps Dependencies list when to update callback.
 * @param delay Debounce delay.
 * @param maxWait The maximum time `callback` is allowed to be delayed before
 * it's invoked. 0 means no max wait.
 */
export function useDebouncedCallback<Fn extends (...args: any[]) => any>(
    callback: Fn,
    deps: DependencyList,
    delay: number,
    maxWait = 0,
): IDebouncedFunction<Fn> {
    const timeout = useRef<ReturnType<typeof setTimeout>>();
    const waitTimeout = useRef<ReturnType<typeof setTimeout>>();
    const lastCall = useRef<{ args: Parameters<Fn>; this: ThisParameterType<Fn> }>();

    const clear = () => {
        if (timeout.current) {
            clearTimeout(timeout.current);
            timeout.current = undefined;
        }

        if (waitTimeout.current) {
            clearTimeout(waitTimeout.current);
            waitTimeout.current = undefined;
        }
    };

    // cancel scheduled execution on unmount
    useUnmountEffect(clear);

    return useMemo(
        () => {
            const execute = () => {
                // barely possible to test this line
                /* istanbul ignore next */
                if (!lastCall.current) return;

                const context = lastCall.current;
                lastCall.current = undefined;

                callback.apply(context.this, context.args);

                clear();
            };

            // eslint-disable-next-line func-names
            const wrapped = function (this, ...args) {
                if (timeout.current) {
                    clearTimeout(timeout.current);
                }

                lastCall.current = { args, this: this };

                // plan regular execution
                timeout.current = setTimeout(execute, delay);

                // plan maxWait execution if required
                if (maxWait > 0 && !waitTimeout.current) {
                    waitTimeout.current = setTimeout(execute, maxWait);
                }
            } as IDebouncedFunction<Fn>;

            Object.defineProperties(wrapped, {
                length: { value: callback.length },
                name: { value: `${callback.name || 'anonymous'}__debounced__${delay}` },
            });

            return wrapped;
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [delay, maxWait, ...deps],
    );
}

export interface IThrottledFunction<Fn extends (...args: any[]) => any> {
    (this: ThisParameterType<Fn>, ...args: Parameters<Fn>): void;
}

/**
 * Makes passed function throttled, otherwise acts like `useCallback`.
 *
 * @param callback Function that will be throttled.
 * @param deps Dependencies list when to update callback.
 * @param delay Throttle delay.
 * @param noTrailing If `noTrailing` is true, callback will only execute every
 * `delay` milliseconds, otherwise, callback will be executed one final time
 * after the last throttled-function call.
 */
export function useThrottledCallback<Fn extends (...args: any[]) => any>(
    callback: Fn,
    deps: DependencyList,
    delay: number,
    noTrailing = false,
): IThrottledFunction<Fn> {
    const timeout = useRef<ReturnType<typeof setTimeout>>();
    const lastCall = useRef<{ args: Parameters<Fn>; this: ThisParameterType<Fn> }>();

    useUnmountEffect(() => {
        if (timeout.current) {
            clearTimeout(timeout.current);
        }
    });

    return useMemo(() => {
        const execute = (context: ThisParameterType<Fn>, args: Parameters<Fn>) => {
            lastCall.current = undefined;
            callback.apply(context, args);

            timeout.current = setTimeout(() => {
                timeout.current = undefined;

                // if trailing execution is not disabled - call callback with last
                // received arguments and context
                if (!noTrailing && lastCall.current) {
                    execute(lastCall.current.this, lastCall.current.args);

                    lastCall.current = undefined;
                }
            }, delay);
        };

        // eslint-disable-next-line func-names
        const wrapped = function (this, ...args) {
            if (timeout.current) {
                // if we cant execute callback immediately - save its arguments and
                // context to execute it when delay is passed
                lastCall.current = { args, this: this };

                return;
            }

            execute(this, args);
        } as IThrottledFunction<Fn>;

        Object.defineProperties(wrapped, {
            length: { value: callback.length },
            name: { value: `${callback.name || 'anonymous'}__throttled__${delay}` },
        });

        return wrapped;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [delay, noTrailing, ...deps]);
}
