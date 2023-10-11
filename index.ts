import { Declaration, Root, Rule, AtRule } from 'postcss'
import type { DefaultOptions } from './src/types'
import { defaultOptions } from './src/options'
import {
  getTransformValue,
  validateFile,
  validateMediaQuery,
  validateSelector,
  validateProp,
  validateKeyframesQuery,
} from './src/utils'

const CURRENTIGNORE = 'px-to-clamp-ignore'
const NEXTIGNORE = 'px-to-clamp-ignore-next'

const UNITTOCONVERT = 'px'
const unitReg = new RegExp(
  `"[^"]+"|'[^']+'|url\\([^)]+\\)|((?<=^|[^\\w-])-?\\d*\\.?\\d+)${UNITTOCONVERT}\\b`,
  'g'
)

const pxToClamp = (opts: Partial<DefaultOptions> = {}) => {
  const options: DefaultOptions = Object.assign({}, defaultOptions, opts)
  const { replace } = options
  let next: Declaration
  return {
    postcssPlugin: 'postcss-px-to-clamp',

    Once(root: Root): void {
      if (!validateFile(options, root.source?.input.file?.replace(/\\/g, '/')))
        return

      root.walkRules((rule: Rule) => {
        if (!validateSelector(options, rule.selectors)) return

        rule.walkDecls((decl: Declaration) => {
          if (decl === next) return

          const annotation = decl.prev()
          if (annotation?.type === 'comment') {
            if (annotation.text === NEXTIGNORE) {
              annotation.remove()
              return
            }
          }
          const nextAnnotation = decl.next()
          if (nextAnnotation?.type === 'comment') {
            if (nextAnnotation.text === CURRENTIGNORE) {
              nextAnnotation.remove()
              return
            }
          }

          if (!~decl.value.indexOf(UNITTOCONVERT)) return
          if (!validateProp(options, decl.prop)) return
          if (!validateMediaQuery(options, rule.parent as AtRule)) return
          if (!validateKeyframesQuery(options, rule.parent as AtRule)) return
          if (/^url\(|'|"/.test(decl.value)) return

          const value = decl.value.replace(unitReg, (string) =>
            getTransformValue(string, decl.prop, options)
          )
          if (replace) {
            decl.value = value
          } else {
            next = decl.cloneAfter(decl.clone({ value }))
          }
        })
      })
    },
  }
}

pxToClamp.postcss = true

export = pxToClamp
