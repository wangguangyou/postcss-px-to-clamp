export interface DefaultOptions {
  viewportWidth: number
  maxViewportWidth?: string
  minViewportWidth?: string
  unitPrecision: number
  selectorBlackList: (string | RegExp)[]
  propBlackList: (string | RegExp)[]
  minPixelValue: number
  mediaQuery: boolean
  keyframesQuery: boolean
  replace: boolean
  include?: RegExp | RegExp[]
  exclude?: RegExp | RegExp[]
}
