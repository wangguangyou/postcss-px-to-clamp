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
  options: DefaultOptions
): string => {
  const {
    maxViewportWidth,
    minViewportWidth,
    viewportWidth,
    unitPrecision,
    minPixelValue,
  } = options

  if (Math.abs(parseInt(string)) === 0) return string
  if (Math.abs(parseInt(string)) <= minPixelValue) return string
  const value = parseInt(string) / viewportWidth
  let result = `${toFixed(value * 100, unitPrecision)}vw`

  if (maxViewportWidth) {
    result = `calc(${toFixed(
      value,
      unitPrecision
    )} * min(100vw, ${maxViewportWidth}))`
  }
  if (minViewportWidth) {
    result = `calc(${toFixed(
      value,
      unitPrecision
    )} * max(100vw, ${minViewportWidth}))`
  }
  if (maxViewportWidth && minViewportWidth) {
    result = `calc(${toFixed(
      value,
      unitPrecision
    )} * clamp(${minViewportWidth}, 100vw, ${maxViewportWidth}))`
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
