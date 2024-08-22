import { ToastCloseButtonPositionsType } from "./ToastCloseButtonPositionsType"
import { ToastTypesType } from "./ToastTypesType"

export type ToastHtmlOptionsType = {
  title?: string
  content: string
  type?: ToastTypesType
  showCloseButton?: boolean
  closeButtonPosition?: ToastCloseButtonPositionsType
}
