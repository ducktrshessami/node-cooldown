type Callback<T> = (...args: any[]) => T;
type AsyncCallback<T> = (...args: any[]) => Promise<T>;

interface CooldownFunction<T> extends Callback<T | void> {
    ready: Boolean;
}

interface CooldownAsyncFunction<T> extends AsyncCallback<T | void> {
    ready: Boolean;
}

export function cooldown<T>(callback: Callback<T>, ms: number = 0): CooldownFunction<T> {
    let ready = true;
    let wrapped = function (this: CooldownFunction<T>, ...args: Parameters<typeof callback>) {
        if (ready) {
            ready = false;
            setTimeout(() => ready = true, ms);
            return callback.apply(this, args);
        }
    };
    Object.defineProperty(wrapped, "ready", {
        get: () => ready,
        enumerable: true
    });
    return <CooldownFunction<T>>wrapped;
}

// Always async
export function cooldownAsync<T>(callback: AsyncCallback<T>, ms: number = 0): CooldownAsyncFunction<T> {
    let ready = true;
    let wrapped = async function (this: CooldownFunction<T>, ...args: Parameters<typeof callback>) {
        if (ready) {
            ready = false;
            setTimeout(() => ready = true, ms);
            return callback.apply(this, args);
        }
    };
    Object.defineProperty(wrapped, "ready", {
        get: () => ready,
        enumerable: true
    });
    return <CooldownAsyncFunction<T>>wrapped;
}
