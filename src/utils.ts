import type { DefaultOptions } from './types'
import type { AtRule } from 'postcss'
export const toFixed = (num: number, precision: number): string => {
  const times = 10 ** precision
  let des = num * times + 0.5
  des = Math.floor(des) / times
  return String(des)
}

export const getTransformValue = (
  string: string,
  prop: string,
  options: DefaultOptions
): string => {
  const {
    maxViewportWidth,
    minViewportWidth,
    viewportWidth,
    unitPrecision,
    minPixelValue,
    viewportUnit,
    fontViewportUnit,
  } = options
  const unit = ~prop.indexOf('font') ? fontViewportUnit : viewportUnit
  if (Math.abs(parseFloat(string)) === 0) return string
  if (Math.abs(parseFloat(string)) <= minPixelValue) return string
  const value = parseFloat(string) / viewportWidth
  let result = `${toFixed(value * 100, unitPrecision)}${unit}`

  if (maxViewportWidth) {
    result = `calc(${toFixed(
      value,
      unitPrecision
    )} * min(100${unit}, ${maxViewportWidth}))`
  }
  if (minViewportWidth) {
    result = `calc(${toFixed(
      value,
      unitPrecision
    )} * max(100${unit}, ${minViewportWidth}))`
  }
  if (maxViewportWidth && minViewportWidth) {
    result = `calc(${toFixed(
      value,
      unitPrecision
    )} * clamp(${minViewportWidth}, 100${unit}, ${maxViewportWidth}))`
  }

  return result
}

export function validateMediaQuery(options: DefaultOptions, atRule: AtRule) {
  const { name, params } = atRule
  if (name !== 'keyframes') {
    return !params || (params && options.mediaQuery)
  }
  return true
}

export function validateKeyframesQuery(
  options: DefaultOptions,
  atRule: AtRule
) {
  const { name, params } = atRule
  if (name === 'keyframes') {
    return !params || (params && options.keyframesQuery)
  }
  return true
}

export const validateSelector = (
  options: DefaultOptions,
  selectors: string[]
) => {
  const { selectorBlackList } = options

  return !selectorBlackList.some((rule) => {
    return typeof rule === 'string'
      ? selectors.includes(rule)
      : selectors.some((selector) => rule.test(selector))
  })
}

export const validateProp = (options: DefaultOptions, prop: string) => {
  const { propBlackList } = options

  return !propBlackList.some((rule) => {
    return typeof rule === 'string' ? ~prop.indexOf(rule) : rule.test(prop)
  })
}

export const validateFile = (options: DefaultOptions, file?: string) => {
  const { include, exclude } = options

  if (file) {
    if (include) {
      const _include = Array.isArray(include) ? include : [include]
      if (!_include.some((value) => value.test(file))) {
        return
      }
    }

    if (exclude) {
      const _exclude = Array.isArray(exclude) ? exclude : [exclude]
      if (_exclude.some((value) => value.test(file))) {
        return
      }
    }
  }

  return true
}
