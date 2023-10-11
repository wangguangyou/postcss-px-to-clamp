const postcss = require('postcss')
const fs = require('fs/promises')
const plugin = require('../dist')
const path = require('path')

const resolve = (p) => path.resolve(__dirname, p)

async function run(input, output, opts = {}) {
  const inputCss = await fs.readFile(input)
  const outputCss = await fs.readFile(output, 'utf-8')
  let result = await postcss([plugin(opts)]).process(inputCss, { from: input })
  expect(result.css).toEqual(outputCss)
  expect(result.warnings()).toHaveLength(0)
}

describe('viewport', () => {
  it('maxViewportWidth', async () => {
    await run(
      resolve('./viewport/maxViewportWidth.i.css'),
      resolve('./viewport/maxViewportWidth.o.css'),
      {
        maxViewportWidth: '1600px',
      }
    )
  })
  it('minViewportWidth', async () => {
    await run(
      resolve('./viewport/minViewportWidth.i.css'),
      resolve('./viewport/minViewportWidth.o.css'),
      {
        minViewportWidth: '200px',
      }
    )
  })
  it('minViewportWidth&maxViewportWidth', async () => {
    await run(
      resolve('./viewport/minViewportWidth&maxViewportWidth.i.css'),
      resolve('./viewport/minViewportWidth&maxViewportWidth.o.css'),
      {
        minViewportWidth: '200px',
        maxViewportWidth: '1600px',
      }
    )
  })
})

describe('filter', () => {
  it('exclude regexg', async () => {
    await run(resolve('./filter/index.css'), resolve('./filter/index.css'), {
      exclude: /\/filter\//,
    })
  })
  it('exclude array of regexg', async () => {
    await run(resolve('./filter/index.css'), resolve('./filter/index.css'), {
      exclude: [/\/filter\//],
    })
  })
  it('include', async () => {
    await run(resolve('./filter/index.css'), resolve('./filter/index.css'), {
      include: [/\/node_modules\//],
    })
  })
  it('selectorBlackList', async () => {
    await run(
      resolve('./filter/index.css'),
      resolve('./filter/selectorBlackList.css'),
      {
        selectorBlackList: ['.ignore', /^\.s/, /.e/],
      }
    )
  })
  it('propBlackList', async () => {
    await run(
      resolve('./filter/index.css'),
      resolve('./filter/propBlackList.css'),
      {
        propBlackList: ['font', /border/],
      }
    )
  })
  it('minPixelValue', async () => {
    await run(
      resolve('./filter/index.css'),
      resolve('./filter/minPixelValue.css'),
      {
        minPixelValue: 2,
      }
    )
  })
  it('mediaQuery', async () => {
    await run(
      resolve('./filter/mediaQuery.i.css'),
      resolve('./filter/mediaQuery.o.css'),
      {
        mediaQuery: true,
      }
    )
  })

  it('keyframesQuery', async () => {
    await run(
      resolve('./filter/keyframesQuery.i.css'),
      resolve('./filter/keyframesQuery.o.css'),
      {
        keyframesQuery: true,
        minViewportWidth: '200px',
        maxViewportWidth: '1200px',
      }
    )
  })

  it('comment', async () => {
    await run(
      resolve('./filter/comment.i.css'),
      resolve('./filter/comment.o.css'),
      {
        keyframesQuery: true,
        minViewportWidth: '200px',
        maxViewportWidth: '1200px',
      }
    )
  })
})

describe('other', () => {
  it('replace', async () => {
    await run(resolve('./replace.i.css'), resolve('./replace.o.css'), {
      replace: false,
    })
  })
  it('default', async () => {
    await run(resolve('./default.i.css'), resolve('./default.o.css'))
  })
  it('var', async () => {
    await run(resolve('./var.i.css'), resolve('./var.o.css'), {
      mediaQuery: true,
    })
  })
  it('url', async () => {
    await run(resolve('./url.i.css'), resolve('./url.o.css'), {})
  })
})
