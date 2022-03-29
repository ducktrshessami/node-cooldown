declare module "cooldown" {
    type Callback<T> = (...args?: any[]) => T;
    type AsyncCallback<T> = (...args?: any[]) => Promise<T>;

    interface CooldownFunction<T> extends Callback<T | void> {
        ready: Boolean;
    }

    interface CooldownAsyncFunction<T> extends AsyncCallback<T | void> {
        ready: Boolean;
    }

    export function cooldown<T>(callback: Callback<T>, ms: number): CooldownFunction<T>;
    export function cooldownAsync<T>(callback: AsyncCallback<T>, ms: number): CooldownAsyncFunction<T>;
}
