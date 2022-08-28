'use strict'

var fs = require('fs/promises')
var path = require('path')
var postcss = require('postcss')
var plugin = require('../dist')

const options = {
  minViewportWidth: '200px',
  maxViewportWidth: '1200px',
  propBlackList: [],
  selectorBlackList: ['.f'],
  replace: true,
  keyframesQuery: true,
  mediaQuery: true,
}
;(async function () {
  const input = await fs.readFile(path.resolve(__dirname, 'input.css'), 'utf8')
  const result = await postcss([plugin(options)]).process(input, {
    from: undefined,
  })

  await fs.writeFile(path.resolve(__dirname, 'output.css'), result.css)
})()
