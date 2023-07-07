# postcss-droproot
>
> Remove :root rules

## Installation

```sh
yarn add -D postcss-droproot
postcss -u postcss-droproot -o dist/index.css src/index.css
```

## Usage

Let's say you have `:root {}` rules you want gone. This plugin turns this:

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

## TODO

- [ ] Add flag to keep fallback values for variables defined at root
- [ ] Support `:root` prefixed selectors by dropping the prefix and retaining the rest of the selector
