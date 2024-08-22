import {
  checkCircleSolidIcon,
  infoCircleSolidIcon,
  loaderIcon,
  warningCircleSolidIcon,
  warningTriangleSolidIcon
} from '../icons'

export const TOAST_ICONS_MAP = {
  success: checkCircleSolidIcon,
  error: warningCircleSolidIcon,
  warning: warningTriangleSolidIcon,
  info: infoCircleSolidIcon,
  loading: loaderIcon
}
