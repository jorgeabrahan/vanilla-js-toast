import {
  TOAST_CLOSE_BUTTON_POSITIONS,
  TOAST_ICONS_MAP,
  TOAST_POSITIONS,
  TOAST_TYPES
} from '../lib/consts'
import { xmarkIcon } from '../lib/icons'
import type {
  PromiseToastOptionsType,
  PromiseToastToastsType,
  ToastCloseButtonPositionsType,
  ToastConstructorOptionsType,
  ToastHtmlOptionsType,
  ToastOptionsType,
  ToastPositionsType,
  ToastTypesType
} from '../lib/types'

export class Toast {
  #toastsContainer: HTMLElement
  #toastsContainerPosition: ToastPositionsType
  #toastClassesPrefix: string = 'vjs'
  #toastIconSizePx: number
  #toastRichColors: boolean
  #toastDurationMs: number
  #toastShowCloseButton: boolean
  #toastCloseButtonPosition: ToastCloseButtonPositionsType
  #toastPreventClosingOnHover: boolean
  constructor({
    position = TOAST_POSITIONS.br,
    maxWidthPx = 400,
    defaultIconSizePx = 18,
    richColors = true,
    preventClosingOnHover = true,
    durationMs = 5000,
    showCloseButton = false,
    closeButtonPosition = TOAST_CLOSE_BUTTON_POSITIONS.tr
  }: ToastConstructorOptionsType = {}) {
    this.#toastsContainer = document.createElement('div')
    this.#toastsContainer.classList.add(`${this.#toastClassesPrefix}-toasts`)
    this.#toastsContainer.style.maxWidth = `${maxWidthPx}px`

    this.#toastsContainerPosition = position
    this.#toastIconSizePx = defaultIconSizePx
    this.#toastRichColors = richColors
    this.#toastDurationMs = durationMs
    this.#toastShowCloseButton = showCloseButton
    this.#toastCloseButtonPosition = closeButtonPosition
    this.#toastPreventClosingOnHover = preventClosingOnHover

    this.#positionToastsContainer()

    document.body.appendChild(this.#toastsContainer)
  }

  #getToastHTML({
    title = '',
    content,
    type = TOAST_TYPES.default,
    showCloseButton,
    closeButtonPosition
  }: ToastHtmlOptionsType) {
    const toastContainer = document.createElement('div')
    toastContainer.classList.add(`${this.#toastClassesPrefix}-toast`)
    if (type !== TOAST_TYPES.default && type !== TOAST_TYPES.loading && this.#toastRichColors) {
      toastContainer.classList.add(`${this.#toastClassesPrefix}-toast--${type}`)
    }
    toastContainer.id = `${this.#toastClassesPrefix}-${crypto.randomUUID()}`

    const toastShowCloseButton = showCloseButton ?? this.#toastShowCloseButton
    if (toastShowCloseButton) {
      const closeButton = document.createElement('button')
      closeButton.classList.add(`${this.#toastClassesPrefix}-toast__close-button`)
      const toastCloseButtonPosition = closeButtonPosition ?? this.#toastCloseButtonPosition
      closeButton.classList.add(
        `${this.#toastClassesPrefix}-toast__close-button--${
          toastCloseButtonPosition === 'tr' ? 'right' : 'left'
        }`
      )
      closeButton.innerHTML = xmarkIcon(14)
      closeButton.addEventListener('click', () => {
        this.#fadeOutToast(toastContainer)
      })
      toastContainer.appendChild(closeButton)
    }

    if (type !== TOAST_TYPES.default) {
      const svgIconContainer = document.createElement('div')
      svgIconContainer.classList.add(`${this.#toastClassesPrefix}-toast__icon`)
      if (type === TOAST_TYPES.loading) {
        svgIconContainer.classList.add(`${this.#toastClassesPrefix}-animate-spin`)
      }
      svgIconContainer.innerHTML = TOAST_ICONS_MAP[type](this.#toastIconSizePx)
      toastContainer.appendChild(svgIconContainer)
    }

    const toastDetailsContainer = document.createElement('div')
    toastDetailsContainer.classList.add(`${this.#toastClassesPrefix}-toast__details`)

    if (title && title.length > 0) {
      const toastTitle = document.createElement('h3')
      toastTitle.classList.add(`${this.#toastClassesPrefix}-toast__title`)
      toastTitle.textContent = title
      toastDetailsContainer.appendChild(toastTitle)
    }

    const toastContent = document.createElement('p')
    toastContent.classList.add(`${this.#toastClassesPrefix}-toast__content`)
    toastContent.textContent = content
    toastDetailsContainer.appendChild(toastContent)

    toastContainer.appendChild(toastDetailsContainer)
    return toastContainer
  }
  #fadeOutToast(toastContainer: HTMLDivElement) {
    const isToastRemoved = this.#toastsContainer.querySelector(`#${toastContainer.id}`) == null
    if (isToastRemoved) return
    const fadeOutClass = `${this.#toastClassesPrefix}-animate-fade-out`
    toastContainer.classList.add(fadeOutClass)
    toastContainer.addEventListener(
      'animationend',
      () => {
        this.#toastsContainer.removeChild(toastContainer)
      },
      false
    )
  }
  #fadeInToast(toastContainer: HTMLDivElement) {
    this.#toastsContainer.appendChild(toastContainer)
    let positionToAppearFrom: 'top' | 'bottom' = 'bottom'
    if (this.#toastsContainerPosition.includes('t')) positionToAppearFrom = 'top'
    const fadeInClass = `${this.#toastClassesPrefix}-animate-fade-in-${positionToAppearFrom}`
    toastContainer.classList.add(fadeInClass)
  }
  #renderToast(toastContainer: HTMLDivElement, durationMs?: number) {
    this.#fadeInToast(toastContainer)

    const toastDurationMs = durationMs ?? this.#toastDurationMs
    if (toastDurationMs == Infinity) return
    let timeOutId = setTimeout(() => this.#fadeOutToast(toastContainer), toastDurationMs)

    if (!this.#toastPreventClosingOnHover) return

    toastContainer.addEventListener('mouseenter', () => {
      clearTimeout(timeOutId)
    })
    toastContainer.addEventListener('mouseleave', () => {
      timeOutId = setTimeout(() => this.#fadeOutToast(toastContainer), toastDurationMs)
    })
  }
  #createAndShowToast(content: string, type: ToastTypesType, options?: ToastOptionsType) {
    const toastContainer = this.#getToastHTML({
      title: options?.title,
      content,
      type,
      showCloseButton: options?.showCloseButton,
      closeButtonPosition: options?.closeButtonPosition
    })
    this.#renderToast(toastContainer, options?.durationMs)
    return toastContainer.id
  }
  remove(toastId: string) {
    const toastContainer = this.#toastsContainer.querySelector(`#${toastId}`) as HTMLDivElement
    if (toastContainer) this.#fadeOutToast(toastContainer)
  }

  default(content: string, options?: ToastOptionsType) {
    return this.#createAndShowToast(content, TOAST_TYPES.default, options)
  }

  success(content: string, options?: ToastOptionsType) {
    return this.#createAndShowToast(content, TOAST_TYPES.success, options)
  }

  error(content: string, options?: ToastOptionsType) {
    return this.#createAndShowToast(content, TOAST_TYPES.error, options)
  }

  warning(content: string, options?: ToastOptionsType) {
    return this.#createAndShowToast(content, TOAST_TYPES.warning, options)
  }

  info(content: string, options?: ToastOptionsType) {
    return this.#createAndShowToast(content, TOAST_TYPES.info, options)
  }
  loading(content: string, options?: ToastOptionsType) {
    return this.#createAndShowToast(content, TOAST_TYPES.loading, options)
  }
  #replaceToastContent(toastId: string, content: HTMLDivElement) {
    const toastContainer = this.#toastsContainer.querySelector(`#${toastId}`) as HTMLDivElement
    toastContainer.className = content.className
    toastContainer.innerHTML = content.innerHTML
  }
  promise(
    promise: Promise<any>,
    toasts: PromiseToastToastsType,
    options: PromiseToastOptionsType = {}
  ) {
    const toastId = this.loading(toasts.loading.content, {
      title: toasts.loading?.title,
      durationMs: Infinity,
      showCloseButton: false
    })
    const toastShowCloseButton = options?.showCloseButtonWhenDone ?? this.#toastShowCloseButton
    const toastCloseButtonPosition =
      options?.closeButtonPositionWhenDone ?? this.#toastCloseButtonPosition
    promise
      .then(() => {
        const toastContainer = this.#getToastHTML({
          title: toasts.success?.title,
          content: toasts.success.content,
          type: TOAST_TYPES.success,
          showCloseButton: toastShowCloseButton,
          closeButtonPosition: toastCloseButtonPosition
        })
        this.#replaceToastContent(toastId, toastContainer)
      })
      .catch(() => {
        const toastContainer = this.#getToastHTML({
          title: toasts.error?.title,
          content: toasts.error.content,
          type: TOAST_TYPES.error,
          showCloseButton: toastShowCloseButton,
          closeButtonPosition: toastCloseButtonPosition
        })
        this.#replaceToastContent(toastId, toastContainer)
      })
      .finally(() => {
        const toastContainer = this.#toastsContainer.querySelector(`#${toastId}`) as HTMLDivElement
        const toastDurationMs = options?.durationWhenDoneMs ?? this.#toastDurationMs
        let timeOutId = setTimeout(() => {
          this.#fadeOutToast(toastContainer)
        }, toastDurationMs)

        if (!this.#toastPreventClosingOnHover) return

        toastContainer.addEventListener('mouseenter', () => {
          clearTimeout(timeOutId)
        })
        toastContainer.addEventListener('mouseleave', () => {
          timeOutId = setTimeout(() => this.#fadeOutToast(toastContainer), toastDurationMs)
        })
      })
    return promise
  }
  #positionToastsContainer() {
    this.#toastsContainer.style.position = 'fixed'

    if (this.#toastsContainerPosition.includes('t')) {
      this.#toastsContainer.style.top = '0'
    }
    if (this.#toastsContainerPosition.includes('b')) {
      this.#toastsContainer.style.bottom = '0'
    }
    if (this.#toastsContainerPosition.includes('r')) {
      this.#toastsContainer.style.right = '0'
    }
    if (this.#toastsContainerPosition.includes('l')) {
      this.#toastsContainer.style.left = '0'
    }
    if (this.#toastsContainerPosition.includes('c')) {
      this.#toastsContainer.style.left = '50%'
      this.#toastsContainer.style.transform = 'translateX(-50%)'
    }
  }
}
