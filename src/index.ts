type Callback<P = any, R = any> = (...args: P[]) => R;
type Readiable = { ready: boolean };
type CooldownFunction<C extends Callback> = Readiable & ((...args: Parameters<C>) => ReturnType<C> | void);
type CooldownAsyncFunction<C extends Callback> = Readiable & ((...args: Parameters<C>) => Promise<ReturnType<C> | void>);

export function cooldown<C extends Callback>(callback: C, ms: number = 0): CooldownFunction<C> {
    let ready = true;
    function wrapped(this: unknown, ...args: Parameters<C>): ReturnType<C> | void {
        if (ready) {
            ready = false;
            setTimeout(() => ready = true, ms);
            return callback.apply(this, args);
        }
    }
    Object.defineProperty(wrapped, "ready", {
        get: () => ready,
        enumerable: true
    });
    return <CooldownFunction<C>>wrapped;
}

// Always async
export function cooldownAsync<C extends Callback>(callback: C, ms: number = 0): CooldownAsyncFunction<C> {
    let ready = true;
    async function wrapped(this: unknown, ...args: Parameters<C>): Promise<ReturnType<C> | void> {
        if (ready) {
            ready = false;
            setTimeout(() => ready = true, ms);
            return await callback.apply(this, args);
        }
    }
    Object.defineProperty(wrapped, "ready", {
        get: () => ready,
        enumerable: true
    });
    return <CooldownAsyncFunction<C>>wrapped;
}
