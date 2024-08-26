import { ToastCloseButtonPositionsType } from "./ToastCloseButtonPositionsType";
export type ToastOptionsType = {
    title?: string;
    durationMs?: number;
    showCloseButton?: boolean;
    closeButtonPosition?: ToastCloseButtonPositionsType;
    replaceToastId?: string;
};
