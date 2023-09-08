type Callback<P = any, R = any> = (...args: P[]) => R;
type Readiable = {
    ready: boolean;
};
type CooldownFunction<C extends Callback> = Readiable & ((...args: Parameters<C>) => ReturnType<C> | void);
type CooldownAsyncFunction<C extends Callback> = Readiable & ((...args: Parameters<C>) => Promise<ReturnType<C> | void>);
declare function cooldown<C extends Callback>(callback: C, ms?: number): CooldownFunction<C>;
declare function cooldownAsync<C extends Callback>(callback: C, ms?: number): CooldownAsyncFunction<C>;

export { cooldown, cooldownAsync };
