import type { ToastCloseButtonPositionsType, ToastOptionsType, ToastPositionsType } from '../lib/types';
export declare class Toast {
    #private;
    constructor({ position, maxWidthPx, defaultIconSizePx, richColors, preventClosingOnHover, durationMs, showCloseButton, closeButtonPosition }?: {
        position?: ToastPositionsType;
        maxWidthPx?: number;
        defaultIconSizePx?: number;
        richColors?: boolean;
        durationMs?: number;
        showCloseButton?: boolean;
        preventClosingOnHover?: boolean;
        closeButtonPosition?: ToastCloseButtonPositionsType;
    });
    remove(toastId: string): void;
    default(content: string, options?: ToastOptionsType): string;
    success(content: string, options?: ToastOptionsType): string;
    error(content: string, options?: ToastOptionsType): string;
    warning(content: string, options?: ToastOptionsType): string;
    info(content: string, options?: ToastOptionsType): string;
    loading(content: string, options?: ToastOptionsType): string;
    promise(promise: Promise<any>, toasts: {
        loading: {
            content: string;
            title?: string;
        };
        success: {
            content: string;
            title?: string;
        };
        error: {
            content: string;
            title?: string;
        };
    }, options?: {
        durationWhenDoneMs?: number;
        showCloseButtonWhenDone?: boolean;
        closeButtonPositionWhenDone?: ToastCloseButtonPositionsType;
    }): Promise<any>;
}
