import { ComponentType } from "react";
export declare function setRetrySettings(settings: {
    maxRetryCount?: number;
    retryDelayMs?: number;
}): void;
export declare function retryDynamicImport<T extends ComponentType<any>>(importFunction: () => Promise<{
    default: T;
}>, localMaxRetryCount?: number, localRetryDelayMs?: number): React.LazyExoticComponent<T>;
