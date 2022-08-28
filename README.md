# postcss-px-to-clamp

[PostCSS] plugin that converts px to clamp (clamp(min, val, max) or min(val, max) or max(val, min)).

[PostCSS]: https://github.com/postcss/postcss

```css
.foo {
  width: 20vw;
  height: 20vh;
  line-height: 1.2;
  padding: 20px;
  padding-top: 20px;/* px-to-viewport-ignore */
  /* px-to-viewport-ignore-next */
  padding-left: 20px;
  border: 1px solid #000;
  font-size: 20em;
  margin-top: '20px';
  margin-left: "20px";
  margin-bottom: 20PX;
}
```

```css
.foo {
  width: 20vw;
  height: 20vh;
  line-height: 1.2;
  padding: calc(0.02667 * clamp(200px, 100vw, 1200px));
  padding-top: 20px;
  padding-left: 20px;
  border: 1px solid #000;
  font-size: 20em;
  margin-top: '20px';
  margin-left: "20px";
  margin-bottom: 20PX;
}
```

If your project involves a fixed width, this script will help to convert pixels into viewport units.

### Installation

```sh
npm install --save-dev postcss-px-to-clamp
```

### Usage

Default Options:

```ts
interface DefaultOptions {
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
```

```js
{
  viewportWidth: 750,
  unitPrecision: 5,
  selectorBlackList: [],
  propBlackList: [],
  minPixelValue: 1,
  mediaQuery: false,
  keyframesQuery: false,
  replace: true,
  exclude: undefined,
  include: undefined,
}
```

- `viewportWidth` The width of the viewport.
  - Px will be converted to vw. 
- `minViewportWidth` The minimum width of the viewport.
  - Px will be converted to calc(val / viewportWidth * max(100w, minViewportWidth)). 
- `maxViewportWidth` The maximum width of the viewport.
  - Px will be converted to calc(val / viewportWidth * min(100w, maxViewportWidth)). 
  - If minViewportWidth and maxViewportWidth are both set px will be converted to calc(val / viewportWidth * clamp(minViewportWidth, 100w, maxViewportWidth)).
- `unitPrecision` The decimal numbers to allow the vw units to grow to.
- `selectorBlackList` Exclude selectors.
- `propBlackList` Exclude css properties.
- `minPixelValue` Will not be converted if x is less than or equal to minPixelValue.
- `mediaQuery` Allow px to be converted in media queries.
- `keyframesQuery` Allow px to be converted in keyframes queries.
- `replace` Append css for fallback or replace css.
- `exclude` Exclude some folder'.
- `include` Only included folder will be converted.
