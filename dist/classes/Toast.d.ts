import type { PromiseToastOptionsType, PromiseToastToastsType, ToastCloseButtonPositionsType, ToastConstructorOptionsType, ToastOptionsType, ToastPositionsType, ToastTypesType } from '../lib/types';
export declare class Toast {
    #private;
    constructor({ position, maxWidthPx, defaultIconSizePx, richColors, preventClosingOnHover, durationMs, showCloseButton, closeButtonPosition }?: ToastConstructorOptionsType);
    remove(toastId: string): void;
    default(content: string, options?: ToastOptionsType): string;
    success(content: string, options?: ToastOptionsType): string;
    error(content: string, options?: ToastOptionsType): string;
    warning(content: string, options?: ToastOptionsType): string;
    info(content: string, options?: ToastOptionsType): string;
    loading(content: string, options?: ToastOptionsType): string;
    promise(promise: Promise<any>, toasts: PromiseToastToastsType, options?: PromiseToastOptionsType): Promise<any>;
}
export type ToastType = InstanceType<typeof Toast>;
export type { PromiseToastOptionsType, PromiseToastToastsType, ToastCloseButtonPositionsType, ToastConstructorOptionsType, ToastOptionsType, ToastPositionsType, ToastTypesType };
