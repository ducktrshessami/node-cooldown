declare module "cooldown" {
    export function cooldown<T>(callback: (...args?: any[]) => T, ms: number): (...args?: any[]) => T | void;
    export function cooldownAsync<T>(callback: (...args?: any[]) => Promise<T>, ms: number): (...args?: any[]) => Promise<T | void>;
}
