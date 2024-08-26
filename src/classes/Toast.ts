import {
  TOAST_CLOSE_BUTTON_POSITIONS,
  TOAST_ICONS_MAP,
  TOAST_POSITIONS,
  TOAST_TYPES
} from '../lib/consts'
import { xmarkIcon } from '../lib/icons'
import type {
  ActionToastActionType,
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

  #toastsTimersMap: Map<string, NodeJS.Timeout>
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
    this.#toastsTimersMap = new Map()

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

  #getToastActionHTML(content: string, action: ActionToastActionType, options?: ToastOptionsType) {
    const toastContainer = this.#getToastHTML({
      title: options?.title,
      content,
      type: TOAST_TYPES.default,
      showCloseButton: options?.showCloseButton,
      closeButtonPosition: options?.closeButtonPosition
    })
    const actionButton = document.createElement('button')
    actionButton.classList.add(`${this.#toastClassesPrefix}-toast__action-button`)
    actionButton.textContent = action.label
    actionButton.addEventListener('click', (e) => {
      action.onClick(e)
      this.#fadeOutToast(toastContainer)
    })
    toastContainer.appendChild(actionButton)
    return toastContainer
  }

  #fadeOutToast(toastContainer: HTMLDivElement) {
    if (this.#toastsContainer.querySelector(`#${toastContainer.id}`) == null) return
    const fadeOutClass = `${this.#toastClassesPrefix}-animate-fade-out`
    toastContainer.classList.add(fadeOutClass)
    toastContainer.addEventListener(
      'animationend',
      () => {
        if (this.#toastsContainer.querySelector(`#${toastContainer.id}`) == null) return
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

  #preventToastClosingOnHover(toastContainer: HTMLDivElement, toastDurationMs: number) {
    toastContainer.addEventListener('mouseenter', () => {
      const timeOutId = this.#toastsTimersMap.get(toastContainer.id)
      if (timeOutId) clearTimeout(timeOutId)
      this.#toastsTimersMap.delete(toastContainer.id)
    })
    toastContainer.addEventListener('mouseleave', () => {
      const timeOutId = setTimeout(() => {
        this.#fadeOutToast(toastContainer)
        this.#toastsTimersMap.delete(toastContainer.id)
      }, toastDurationMs)
      this.#toastsTimersMap.set(toastContainer.id, timeOutId)
    })
  }

  #renderToast(toastContainer: HTMLDivElement, durationMs?: number) {
    this.#fadeInToast(toastContainer)

    const toastDurationMs = durationMs ?? this.#toastDurationMs
    if (toastDurationMs == Infinity) return

    let timeOutId = setTimeout(() => {
      this.#fadeOutToast(toastContainer)
      this.#toastsTimersMap.delete(toastContainer.id)
    }, toastDurationMs)
    this.#toastsTimersMap.set(toastContainer.id, timeOutId)

    if (!this.#toastPreventClosingOnHover) return

    this.#preventToastClosingOnHover(toastContainer, toastDurationMs)
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

  #attachCloseListenerAfterReplacement(replaceToastId: string) {
    const toastContainer = this.#toastsContainer.querySelector(
      `#${replaceToastId}`
    ) as HTMLDivElement
    if (!toastContainer) return console.warn(`Toast with id ${replaceToastId} not found in DOM`)
    const closeButton = toastContainer.querySelector(
      `button.${this.#toastClassesPrefix}-toast__close-button`
    ) as HTMLButtonElement
    if (!closeButton) return
    closeButton.addEventListener('click', () => {
      this.#fadeOutToast(toastContainer)
    })
  }

  remove(toastId: string) {
    const toastContainer = this.#toastsContainer.querySelector(`#${toastId}`) as HTMLDivElement
    if (toastContainer) this.#fadeOutToast(toastContainer)
  }

  default(content: string, options?: ToastOptionsType) {
    const replaceToastId = options?.replaceToastId
    if (replaceToastId) {
      this.#replaceToastContentAndTimer(
        replaceToastId,
        TOAST_TYPES.default,
        content,
        options
      )
      this.#attachCloseListenerAfterReplacement(replaceToastId)
      return replaceToastId
    }
    return this.#createAndShowToast(content, TOAST_TYPES.default, options)
  }

  success(content: string, options?: ToastOptionsType) {
    const replaceToastId = options?.replaceToastId
    if (replaceToastId) {
      this.#replaceToastContentAndTimer(
        replaceToastId,
        TOAST_TYPES.success,
        content,
        options
      )
      this.#attachCloseListenerAfterReplacement(replaceToastId)
      return replaceToastId
    }
    return this.#createAndShowToast(content, TOAST_TYPES.success, options)
  }

  error(content: string, options?: ToastOptionsType) {
    const replaceToastId = options?.replaceToastId
    if (replaceToastId) {
      this.#replaceToastContentAndTimer(replaceToastId, TOAST_TYPES.error, content, options)
      this.#attachCloseListenerAfterReplacement(replaceToastId)
      return replaceToastId
    }
    return this.#createAndShowToast(content, TOAST_TYPES.error, options)
  }

  warning(content: string, options?: ToastOptionsType) {
    const replaceToastId = options?.replaceToastId
    if (replaceToastId) {
      this.#replaceToastContentAndTimer(
        replaceToastId,
        TOAST_TYPES.warning,
        content,
        options
      )
      this.#attachCloseListenerAfterReplacement(replaceToastId)
      return replaceToastId
    }
    return this.#createAndShowToast(content, TOAST_TYPES.warning, options)
  }

  info(content: string, options?: ToastOptionsType) {
    const replaceToastId = options?.replaceToastId
    if (replaceToastId) {
      this.#replaceToastContentAndTimer(replaceToastId, TOAST_TYPES.info, content, options)
      this.#attachCloseListenerAfterReplacement(replaceToastId)
      return replaceToastId
    }
    return this.#createAndShowToast(content, TOAST_TYPES.info, options)
  }

  loading(content: string, options?: ToastOptionsType) {
    const replaceToastId = options?.replaceToastId
    if (replaceToastId) {
      this.#replaceToastContentAndTimer(
        replaceToastId,
        TOAST_TYPES.loading,
        content,
        options
      )
      this.#attachCloseListenerAfterReplacement(replaceToastId)
      return replaceToastId
    }
    return this.#createAndShowToast(content, TOAST_TYPES.loading, options)
  }

  action(content: string, action: ActionToastActionType, options?: ToastOptionsType) {
    const replaceToastId = options?.replaceToastId
    if (replaceToastId) {
      const toastDurationMs = options?.durationMs ?? this.#toastDurationMs
      this.#replaceToastContent(replaceToastId, this.#getToastActionHTML(content, action, options))
      const toastActiveTimerId = this.#toastsTimersMap.get(replaceToastId)
      if (toastActiveTimerId) clearTimeout(toastActiveTimerId)
      const attachActionListenerAfterReplacement = () => {
        const toastContainer = this.#toastsContainer.querySelector(
          `#${replaceToastId}`
        ) as HTMLDivElement
        if (!toastContainer) return console.warn(`Toast with id ${replaceToastId} not found in DOM`)
        const actionButton = toastContainer.querySelector(
          `button.${this.#toastClassesPrefix}-toast__action-button`
        ) as HTMLButtonElement
        if (!actionButton)
          return console.warn(`Action button from toast with id ${replaceToastId} not found in DOM`)
        actionButton.addEventListener('click', (e) => {
          action.onClick(e)
          this.#fadeOutToast(toastContainer)
        })
      }
      attachActionListenerAfterReplacement()
      this.#attachCloseListenerAfterReplacement(replaceToastId)
      const handleToastTimer = () => {
        const toastContainer = this.#toastsContainer.querySelector(
          `#${replaceToastId}`
        ) as HTMLDivElement
        if (!toastContainer) return console.warn(`Toast with id ${replaceToastId} not found in DOM`)

        let timeOutId = setTimeout(() => {
          this.#fadeOutToast(toastContainer)
          this.#toastsTimersMap.delete(replaceToastId)
        }, toastDurationMs)
        this.#toastsTimersMap.set(replaceToastId, timeOutId)

        if (!this.#toastPreventClosingOnHover) return

        this.#preventToastClosingOnHover(toastContainer, toastDurationMs)
      }
      if (toastDurationMs != Infinity) handleToastTimer()
      return replaceToastId
    }
    const toastContainer = this.#getToastActionHTML(content, action, options)
    this.#renderToast(toastContainer, options?.durationMs ?? Infinity)
    return toastContainer.id
  }

  #replaceToastContentAndTimer(
    replaceToastId: string,
    type: ToastTypesType,
    content: string,
    options?: ToastOptionsType
  ) {
    const toastDurationMs = options?.durationMs ?? this.#toastDurationMs
    this.#replaceToastContent(
      replaceToastId,
      this.#getToastHTML({
        title: options?.title,
        content,
        type,
        showCloseButton: options?.showCloseButton,
        closeButtonPosition: options?.closeButtonPosition
      })
    )
    const toastActiveTimerId = this.#toastsTimersMap.get(replaceToastId)
    if (toastActiveTimerId) clearTimeout(toastActiveTimerId)

    const handleToastTimer = () => {
      const toastContainer = this.#toastsContainer.querySelector(
        `#${replaceToastId}`
      ) as HTMLDivElement
      if (!toastContainer) return console.warn(`Toast with id ${replaceToastId} not found in DOM`)
      const timeOutId = setTimeout(() => {
        this.#fadeOutToast(toastContainer)
        this.#toastsTimersMap.delete(replaceToastId)
      }, toastDurationMs)
      this.#toastsTimersMap.set(replaceToastId, timeOutId)

      if (!this.#toastPreventClosingOnHover) return
      this.#preventToastClosingOnHover(toastContainer, toastDurationMs)
    }
    if (toastDurationMs != Infinity) handleToastTimer()
    return replaceToastId
  }

  #replaceToastContent(toastId: string, content: HTMLDivElement) {
    const toastContainer = this.#toastsContainer.querySelector(`#${toastId}`) as HTMLDivElement
    if (!toastContainer) return console.warn(`Toast with id ${toastId} not found in DOM`)
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
        if (!toastContainer) {
          return console.warn(`Toast with id ${toastId} not found in DOM`)
        }
        if (toastDurationMs == Infinity) return
        let timeOutId = setTimeout(() => {
          this.#fadeOutToast(toastContainer)
          this.#toastsTimersMap.delete(toastId)
        }, toastDurationMs)
        this.#toastsTimersMap.set(toastId, timeOutId)

        if (!this.#toastPreventClosingOnHover) return

        toastContainer.addEventListener('mouseenter', () => {
          clearTimeout(timeOutId)
          this.#toastsTimersMap.delete(toastId)
        })
        toastContainer.addEventListener('mouseleave', () => {
          timeOutId = setTimeout(() => {
            this.#fadeOutToast(toastContainer)
            this.#toastsTimersMap.delete(toastId)
          }, toastDurationMs)
          this.#toastsTimersMap.set(toastId, timeOutId)
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

export type {
  ToastConstructorOptionsType,
  ToastOptionsType,
  ToastPositionsType,
  ToastTypesType,
  PromiseToastOptionsType,
  PromiseToastToastsType,
  ToastCloseButtonPositionsType
}
