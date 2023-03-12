# postcss-px-to-clamp

[English](README.md) | 中文


基于 [PostCSS8] 转换px为vw，支持通过设置最大、最小视图边界[minViewportWidth, maxViewportWidth]超过边界则按边界大小计算

[PostCSS8]: https://github.com/postcss/postcss

```css
.foo {
  width: 20vw;
  height: 20vh;
  line-height: 1.2;
  padding: 20px;
  padding-top: 20px;/* px-to-clamp-ignore */
  /* px-to-clamp-ignore-next */
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

### 安装

```sh
npm install --save-dev postcss-px-to-clamp
```

### 用法

默认配置:

```ts
interface DefaultOptions {
  viewportWidth: number
  maxViewportWidth?: string
  minViewportWidth?: string
  viewportUnit: 'vw' | 'vmin'
  fontViewportUnit: 'vw' | 'vmin'
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
  viewportUnit: 'vw',
  fontViewportUnit: 'vw',
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

- `viewportWidth` 设计图的宽度
- `viewportUnit` 设置PX将要转换为VW或VMIN(适应横屏)
- `fontViewportUnit` 设置字体属性将要转换的单位
- `minViewportWidth` 设置最小的视图宽度，低于此值后将不再继续缩放
  - px将会被转换为: calc(val / viewportWidth * max(100w, minViewportWidth)).
- `maxViewportWidth` 设置最大的视图宽度，高于此值后将不再继续放大
  - px将会被转换为: calc(val / viewportWidth * min(100w, maxViewportWidth)).
  - 如果 minViewportWidth 与 maxViewportWidth 同时设置px将会被转换为: calc(val / viewportWidth * clamp(minViewportWidth, 100w, maxViewportWidth)).
- `unitPrecision` vw单位的精度
- `selectorBlackList` 设置要排除的选择器
- `propBlackList` 设置要排除的属性
- `minPixelValue` 如果属性的值小于等于此值则不转换
- `mediaQuery` @media里的单位是否需要转换单位
- `keyframesQuery` @keyframes里的单位是否需要转换单位
- `replace` 直接替换原属性值还是在写下一行追加新属性值
- `exclude` 设置排除的文件夹.
- `include` 设置包含的文件夹
