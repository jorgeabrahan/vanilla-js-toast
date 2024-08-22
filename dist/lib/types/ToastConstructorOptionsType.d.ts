import { ToastCloseButtonPositionsType } from "./ToastCloseButtonPositionsType";
import { ToastPositionsType } from "./ToastPositionsType";
export type ToastConstructorOptionsType = {
    position?: ToastPositionsType;
    maxWidthPx?: number;
    defaultIconSizePx?: number;
    richColors?: boolean;
    durationMs?: number;
    showCloseButton?: boolean;
    preventClosingOnHover?: boolean;
    closeButtonPosition?: ToastCloseButtonPositionsType;
};
