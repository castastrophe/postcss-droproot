# postcss-droproot
>
> Remove :root rules

## Installation

```sh
yarn add -D postcss-droproot
postcss -u postcss-droproot -o dist/index.css src/index.css
```

## Usage

Let's say you have `:root` rules that you would like stripped out of your compiled output. This plugin turns this:

```css
:root {
  --prefix-component-background-color: blue;
}

.my-class {
  background-color: var(--prefix-component-background-color);
}
```

Into this:

```css
.my-class {
  background-color: var(--prefix-component-background-color);
}
```

## Options

### `withFallback`

If you wish to preserve the custom property definitions as fallback values in the output, set this flag to `true`. Note that this does not replace the custom property usage with the fallback value, it only adds the fallback value to the custom property definition. If a fallback value already exists, it will **not** be overwritten.

```js
postcss([
  require('postcss-droproot')({
    withFallback: true
  })
])
```

```css
:root {
  --prefix-component-background-color: blue;
}

.my-class {
  background-color: var(--prefix-component-background-color);
}
```

Into this:

```css
.my-class {
  background-color: var(--prefix-component-background-color, blue);
}
```

## TODO

- [ ] Support `:root` prefixed selectors by dropping the prefix and retaining the rest of the selector
